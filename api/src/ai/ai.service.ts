import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  LANGUAGE_LABELS,
  type CodeLanguage,
  normalizeCodeLanguage,
} from '../code-language';
import { formatSourceCode } from '../format-code';
import { formatComplexity } from '../format-complexity';
import { ProblemsService } from '../problems/problems.service';
import type { RunResultDto } from '../problems/run-dto';

export type AiExplainMode = 'hint' | 'full' | 'coach'; // coach = in-place guidance on learner code

export interface AiExplainResult {
  title: string;
  notes?: string;
  description: string;
  time?: string;
  space?: string;
  code?: string;
  language: CodeLanguage;
  model: string;
  mode: AiExplainMode;
  /** Echo of the learner question (coach mode). */
  guidance?: string;
}

type CoachQuestionKind = 'validation' | 'other';

function formatJsonCompact(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatJudgeFailDetail(result: RunResultDto, maxCases = 3): string {
  const fails = result.cases.filter((c) => c.status !== 'passed').slice(0, maxCases);
  if (fails.length === 0) return '';
  return fails
    .map((c, i) => {
      const lines = [
        `Case ${i + 1}: ${c.id} (${c.status})`,
        `  inputs:   ${formatJsonCompact(c.inputs)}`,
        `  expected: ${formatJsonCompact(c.expected)}`,
      ];
      if (c.actual !== undefined) lines.push(`  actual:   ${formatJsonCompact(c.actual)}`);
      if (c.error) lines.push(`  error:    ${c.error}`);
      return lines.join('\n');
    })
    .join('\n\n');
}

/** True when the learner only wants to know if their code works — not how to rewrite it. */
function coachQuestionKind(guidance?: string): CoachQuestionKind {
  if (!guidance) return 'other';
  const q = guidance.toLowerCase();
  const asksRewrite =
    /\b(should i use|instead of|rewrite|change to|switch to|dense_rank|row_number|rank\(\)|vs\.?|versus|difference between|how do i use|show me|example)\b/.test(
      q,
    );
  if (asksRewrite) return 'other';
  if (
    /\b(does it work|will it work|is this correct|is my code|how'?s my code|how is my code|will this pass|does this pass|is it right|is this right|did i get it|anything wrong|any issues|is it good|look(?:s)? (?:ok|good|right))\b/.test(
      q,
    )
  ) {
    return 'validation';
  }
  return 'other';
}

function validationPassedCoachResult(
  language: CodeLanguage,
  judgeSummary: string,
  guidance?: string,
): AiExplainResult {
  return {
    title: 'Yes — it passes',
    description: `Yes — your query passes the studio tests (${judgeSummary}). No changes needed.`,
    language,
    model: 'studio-judge',
    mode: 'coach',
    guidance,
  };
}

function validationFailedCoachResult(
  language: CodeLanguage,
  judgeSummary: string,
  judgeDetail: string | undefined,
  guidance?: string,
): AiExplainResult {
  const detail = judgeDetail ? `\n\n${judgeDetail}` : '';
  return {
    title: 'Not yet — tests failing',
    description: `No — your query does not pass all studio tests (${judgeSummary}).${detail}`,
    language,
    model: 'studio-judge',
    mode: 'coach',
    guidance,
  };
}

function sqlCoachIntentRules(hasGuidance: boolean): string {
  if (!hasGuidance) {
    return `They did not ask a specific question. Give ONE useful next step only if their query is empty or clearly incomplete; otherwise ask what they want help with (do not volunteer a rewrite).`;
  }
  return `Match the LEARNER QUESTION exactly — no more, no less:

1. **Validation** ("does it work?", "how's my code?", "is this correct?", "will this pass?"):
   - Answer yes or no first, in plain language.
   - If JUDGE STATUS is PASSED: say it works / passes studio tests. STOP. Do not suggest a different function, a "better" approach, efficiency, or style changes. Do not mention alternatives (e.g. DENSE_RANK vs ROW_NUMBER) unless they asked about that comparison.
   - If FAILED: say it does not pass yet; one sentence on why (from failing cases). Only then offer a fix — and only for the actual failure.
   - If UNKNOWN: say whether the query looks plausible for the spec; do not invent test failures. Do not rewrite unprompted.
   - Usually **no SQL code block** — a direct answer is enough.

2. **Concept / difference** ("what is DENSE_RANK?", "ROW_NUMBER vs DENSE_RANK?", "why LEFT JOIN?"):
   - Explain in prose, tied to this problem if relevant.
   - Include a small sql example **only if** they asked how to use it or asked for an example. Otherwise prose only.

3. **How-to / finish / stuck on a clause** ("finish this", "help me finish", "the condition is wrong", "I can't choose the right WHERE/HAVING/ON", "how do I rank?", "how do I keep users with zero rides?"):
   - You MUST include at least one markdown sql fence with a **filled-in** PostgreSQL snippet using THIS problem's tables/columns (and their aliases if they already wrote a CTE).
   - Naming HAVING / WHERE / a window without showing the actual predicate is a failure.
   - Scope: the missing or broken clause (5–20 lines). You may show that clause in the context of their current query.
   - Do not dump a from-scratch full rewrite unless they asked for the full query.

4. **Debug / fix** ("why does it fail?", "what's wrong?", failed judge):
   - One failing case → cause → the specific clause to change, with a filled-in sql snippet for that clause.

5. **Full solution** ("write the query", "give me the solution", "what's the full answer"):
   - Step-by-step with fragments, or the complete query in description sql blocks. Still set JSON "code" to "".

If their question is validation (#1), answering with an alternative implementation is WRONG.
If their question is #3–#5, answering with English-only advice (e.g. "add a HAVING clause") and no sql fence is WRONG.`;
}

function sqlSystemPrompt(mode: AiExplainMode, hasGuidance: boolean): string {
  if (mode === 'coach') {
    return `You are a PostgreSQL tutor inside DSA Studio AI. The learner is on **Your code** with an optional question.

Your job is to answer **only what they asked** — not what you think they should learn next.

${sqlCoachIntentRules(hasGuidance)}

Hard rules:
- Do NOT "correct" a working query for efficiency, idiomatic style, or a different pattern they did not ask about.
- Do NOT swap ROW_NUMBER for DENSE_RANK (or similar) unless they asked about ranking functions, asked why it fails, or asked how to fix a tie/rank bug.
- When JUDGE STATUS is PASSED and they ask if it works: the answer is yes. No unsolicited improvements.
- SQL snippets are required for how-to, finish-this, condition-fix, and debug requests — not for "does it work?" unless they also asked how something works.
- When you show SQL, use THIS problem's table/column names (from README/schema) and the learner's CTE/aliases when present. Real predicates only — never "add a HAVING to filter days" without writing the HAVING/WHERE line.
- Never placeholder "…" examples.
- Do not dump the entire finished query unless category #5 above.
- Leave "time" and "space" as empty strings.
- Respond with a single JSON object only (no markdown fences wrapping the JSON).

JSON shape:
{
  "title": "short headline that matches their question (e.g. Yes — it passes)",
  "notes": "one-line takeaway or empty",
  "time": "",
  "space": "",
  "description": "markdown: direct answer first; optional snippet only if their question called for it",
  "code": ""
}`;
  }

  const guidanceRules = hasGuidance
    ? `- CRITICAL: LEARNER GUIDANCE is a hard requirement. Title, description, and any query must follow it (e.g. "window function", "no subqueries", "self-join", "explain DENSE_RANK").
- If they asked how a construct works, teach that construct with a filled-in example on THIS problem — do not switch to a more common default query.
- If the guidance is impossible, say so in the first paragraph, then get as close as practical.
- Start the description with **Guidance:** <restated request>.`
    : `- If the learner provides approach guidance, follow it.`;

  const hintOrFull =
    mode === 'hint'
      ? `- HINT: do not put the complete solution query in "code" (leave code "").
- You MUST still show filled-in clause examples in the description (joins, windows, CASE, CTEs) using this problem's tables — never name DENSE_RANK / LEFT JOIN / etc. without a real snippet.`
      : `- FULL: teach construction step by step, then put the complete PostgreSQL query in "code".
- Each step in the description should include a filled-in fragment, not only English.`;

  return `You are a hands-on PostgreSQL tutor inside DSA Studio AI.
Teach how to construct the query. Naming a function without a copy-pasteable example is a failure.

Rules:
- Recognize the pattern (filter / join / anti-join / aggregation / window / subquery), then build clauses: FROM → JOIN/ON vs WHERE → GROUP/HAVING or OVER → SELECT aliases → ORDER BY if required.
- Walk an example table through the key step (what rows exist after the join or window).
${hintOrFull}
- PostgreSQL syntax. Translate MySQL-only syntax (DATEDIFF, IFNULL) only when relevant.
- Output aliases must match the expected header exactly.
${guidanceRules}
- Format SQL with real newlines, one clause per line, in sql fences inside description.
- Leave "time" and "space" as empty strings.
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences wrapping the JSON).

JSON shape:
{
  "title": "short approach name${hasGuidance ? ' that reflects the learner guidance' : ''}",
  "notes": "one-line takeaway",
  "time": "",
  "space": "",
  "description": "markdown: ${mode === 'hint' ? 'the asked topic or next clause, with filled-in sql examples' : 'recognition, clause-by-clause construction with examples, walkthrough'}",
  "code": "${mode === 'hint' ? '' : 'complete PostgreSQL query'}"
}`;
}

function systemPrompt(language: CodeLanguage, mode: AiExplainMode, hasGuidance: boolean): string {
  if (language === 'sql') return sqlSystemPrompt(mode, hasGuidance);

  const label = LANGUAGE_LABELS[language];

  if (mode === 'coach') {
    return `You are a DSA interview coach inside DSA Studio AI.
The learner is writing their own ${label} solution. Coach them in place — do not solve the problem for them.

Rules:
- Review the learner's current code, optional question, and any JUDGE / FAILING CASES block.
- Lead with what is already correct before any critique.
- Do NOT invent bugs without concrete evidence in their code or the failing cases.
- If their approach is sound and the implementation looks correct, say so clearly. Offer at most light interview polish — not a fault-finding mission.
- When JUDGE STATUS says PASSED for this exact buffer: congratulate; do not invent failures. Optional: brief complexity / interview talking points only.
- When JUDGE STATUS says FAILED (or they ask what to fix / why it fails / how to make it work):
  - Be SPECIFIC to THEIR code. Name the function/method, condition, index, map/key, loop bound, or missing update that is wrong.
  - If FAILING CASES are provided, walk 1 failing case: inputs → what their logic does → why that differs from expected → the exact change to try next.
  - Prefer "change X because Y" over generic advice ("check edge cases", "try a different approach", "think about the problem").
  - One primary bug at a time. End with a single concrete next step they can code immediately.
  - Still no full rewrite and no drop-in solution.
- When they ask what to solve / fix and judge status is unknown: inspect the code carefully; point to the most likely concrete defect you can justify from the code; say if you are uncertain.
- Do NOT provide a complete working solution or a drop-in replacement implementation.
- Short illustrative snippets (a few lines) are OK only to clarify the fix — never the full algorithm.
- Prefer questions and nudges when exploring — but when they are stuck on a failure, prefer a clear diagnosis over Socratic vagueness.
- If their code is empty, help them start (signature, approach sketch, first step) without writing the full algorithm.
- Language is secondary — reason clearly; refer to ${label} only when discussing their code.
- For time/space, prefer Unicode like the rest of the product: O(n²), O(2ⁿ), O(n · m), O(log₁₀ x).
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences).

JSON shape:
{
  "title": "short coaching headline naming the issue or win",
  "notes": "one-line tip",
  "time": "optional complexity note or empty",
  "space": "optional complexity note or empty",
  "description": "markdown: what's working; then concrete diagnosis (code + failing case if any); one next step — no full solution",
  "code": ""
}`;
  }

  const guidanceRules = hasGuidance
    ? `- CRITICAL: The user message includes LEARNER GUIDANCE. That guidance is a hard requirement for this response.
- Build the approach, title, description, and code around that guidance (pattern, data structure, complexity bound, or style).
- Do not substitute a more common default approach (e.g. hash map) when the learner asked for something else.
- If the guidance is impossible or a poor fit, say so in the first paragraph, then still get as close as practical and explain the tradeoff.
- The title must name the guided approach (not a generic "Optimal" / "Recommended" label).
- Start the description with a short line: **Guidance:** <restated learner request>.`
    : `- If the learner provides approach guidance, follow it when designing the solution.`;

  return `You are a DSA interview tutor inside DSA Studio AI.
Given one coding problem, analyze recognition signals and propose one clear interview approach.

Rules:
- Lead with the approach: pattern recognition, why it works, and how to talk through it in an interview.
- Teach walkthroughs with the problem examples; do not dump trivia.
- Language is secondary — reason in language-agnostic steps first. When code is requested, use clear interview-ready ${label} as a vehicle for the approach (not as the point of the lesson).
${guidanceRules}
- Format code with real newlines and indentation (never put an entire function on one line; never escape newlines as \\n inside the JSON string value beyond normal JSON encoding).
- For time/space, prefer Unicode like the rest of the product: O(n²), O(2ⁿ), O(n · m), O(log₁₀ x) — not ASCII n^2 / log10 / *.
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences).

JSON shape:
{
  "title": "short approach name${hasGuidance ? ' that reflects the learner guidance' : ''}",
  "notes": "one-line complexity or interview tip",
  "time": "e.g. O(n), O(n²), O(n log n), O(log₁₀ x)",
  "space": "e.g. O(1), O(n)",
  "description": "markdown: Approach, why it works, example walkthrough (pattern-first, language-light)",
  "code": "${label} source illustrating the approach (omit or empty string in hint mode)"
}`;
}

@Injectable()
export class AiService {
  constructor(@Inject(ProblemsService) private readonly problems: ProblemsService) {}

  status() {
    const configured = Boolean(this.apiKey());
    return {
      configured,
      model: configured ? this.model() : null,
    };
  }

  async explain(
    topic: string,
    slug: string,
    mode: AiExplainMode = 'full',
    languageInput?: string,
    guidanceInput?: string,
    codeInput?: string,
    judgeStatusInput?: string,
    judgeSummaryInput?: string,
    judgeDetailInput?: string,
  ): Promise<AiExplainResult> {
    const language = normalizeCodeLanguage(languageInput);
    const label = LANGUAGE_LABELS[language];
    const guidance = this.normalizeGuidance(guidanceInput);
    const learnerCode = this.normalizeCode(codeInput);
    let judgeStatus = this.normalizeJudgeStatus(judgeStatusInput);
    let judgeSummary = this.normalizeGuidance(judgeSummaryInput);
    let judgeDetail = this.normalizeJudgeDetail(judgeDetailInput);

    let problem;
    try {
      problem = this.problems.getProblem(topic, slug);
    } catch {
      throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    }

    if (mode === 'coach' && learnerCode?.trim() && problem.hasTests) {
      try {
        const judged = await this.problems.runTests(topic, slug, {
          code: learnerCode,
          language,
          mode: 'submit',
        });
        judgeStatus = judged.passed ? 'passed' : 'failed';
        judgeSummary = `${judged.summary.passed}/${judged.summary.total} cases ${
          judged.passed ? 'passed' : 'failed'
        }`;
        judgeDetail = judged.passed ? undefined : formatJudgeFailDetail(judged);
      } catch {
        /* keep client-provided judge hints if runner unavailable */
      }
    }

    if (
      mode === 'coach' &&
      coachQuestionKind(guidance) === 'validation' &&
      judgeStatus === 'passed'
    ) {
      return validationPassedCoachResult(
        language,
        judgeSummary ?? 'all cases passed',
        guidance,
      );
    }

    if (
      mode === 'coach' &&
      coachQuestionKind(guidance) === 'validation' &&
      judgeStatus === 'failed'
    ) {
      return validationFailedCoachResult(
        language,
        judgeSummary ?? 'some cases failed',
        judgeDetail,
        guidance,
      );
    }

    const apiKey = this.apiKey();
    if (!apiKey) {
      throw new ServiceUnavailableException('AI is not configured (missing OPENAI_API_KEY)');
    }

    const model = this.model();
    const modeLine =
      mode === 'hint'
        ? language === 'sql'
          ? 'HINT — teach the next clause with filled-in Postgres on this problem’s tables; do not put the complete solution in code (set code to ""). Naming DENSE_RANK/JOIN/etc. without a real snippet is not allowed.'
          : 'HINT ONLY — explain the approach and walk an example in language-agnostic terms; do not include solution code (set code to "").'
        : mode === 'coach'
          ? language === 'sql'
            ? guidance
              ? 'SQL COACH — Answer ONLY the LEARNER QUESTION. Validation + PASSED → yes, stop, no code. Finish/fix/condition/how-to → MUST include a filled-in sql fence on this schema (not English-only). Set JSON code to "".'
              : judgeStatus === 'passed'
                ? 'SQL COACH — query PASSED; no question typed — say it works; do not suggest changes. Set code to "".'
                : judgeStatus === 'failed'
                  ? 'SQL COACH — FAILED; explain why from failing cases; fix only what failed. Set code to "".'
                  : 'SQL COACH — no specific question; ask what they need or one minimal hint if query empty. Set code to "".'
            : judgeStatus === 'passed'
              ? 'COACH ONLY — their current code PASSED studio tests; affirm what works; light polish only; do not invent bugs; set code to "".'
              : judgeStatus === 'failed'
                ? 'COACH ONLY — code FAILED tests; diagnose the concrete bug using FAILING CASES + their code; one specific next fix; no full rewrite; set code to "".'
                : 'COACH ONLY — guide on their current code; be specific when they ask what to fix; do not invent bugs; no full rewrite; set code to "".'
          : language === 'sql'
            ? 'FULL — teach how to construct the query step by step with filled-in fragments, then include the complete PostgreSQL query in code.'
            : `FULL — teach the approach first, then include a complete ${label} illustration of that approach in code.`;

    const userPrompt = [
      `Mode: ${modeLine}`,
      `Code language: ${label}`,
      `Topic: ${problem.topicTitle} (${topic})`,
      `Difficulty: ${problem.difficulty}`,
      `Slug: ${slug}`,
      `Title: ${problem.title}`,
      '',
      'Problem README:',
      problem.readme,
      language === 'sql' && problem.schemaSql
        ? ['', 'Schema (PostgreSQL DDL — tables already exist; write a query only):', problem.schemaSql].join(
            '\n',
          )
        : '',
      mode === 'coach'
        ? [
            '',
            '=== LEARNER CODE (coach on this; do not replace it) ===',
            learnerCode?.trim() ? learnerCode : '(empty — help them get started)',
            '=== END LEARNER CODE ===',
            '',
            '=== JUDGE STATUS ===',
            judgeStatus === 'passed'
              ? `PASSED — this exact code buffer already passed the studio judge${judgeSummary ? ` (${judgeSummary})` : ''}. If they ask whether it works: answer YES. Do not suggest a different approach, function, or rewrite.`
              : judgeStatus === 'failed'
                ? `FAILED — this exact code buffer failed the studio judge${judgeSummary ? ` (${judgeSummary})` : ''}. Use FAILING CASES below to diagnose a concrete bug in THEIR code. Do not give generic hints.`
                : 'UNKNOWN — no matching judge result for this exact buffer. Do not invent failures; only flag issues you can justify from the code.',
            '=== END JUDGE STATUS ===',
            judgeDetail
              ? [
                  '',
                  '=== FAILING CASES (use these; walk one case against their code) ===',
                  judgeDetail,
                  '=== END FAILING CASES ===',
                ].join('\n')
              : '',
          ]
            .filter(Boolean)
            .join('\n')
        : '',
      guidance
        ? [
            '',
            mode === 'coach'
              ? [
                  '=== LEARNER QUESTION ===',
                  guidance,
                  language === 'sql'
                    ? 'Answer ONLY this question. Validation + PASSED → yes/no, no code. If they asked to finish the query, fix a condition, or how to write a clause: put a filled-in sql snippet in description using their tables/aliases — do not describe HAVING/WHERE without writing it.'
                    : 'Answer this question directly. If they ask what to fix / why it fails / how to make it work, lead with a concrete diagnosis of THEIR code (and failing cases if present), not a generic hint.',
                  '=== END LEARNER QUESTION ===',
                ].join('\n')
              : [
                  '=== LEARNER GUIDANCE (REQUIRED) ===',
                  'Follow this as the primary approach for title, description, and code.',
                  'Do not fall back to a more common default approach unless this guidance is impossible.',
                  guidance,
                  '=== END LEARNER GUIDANCE ===',
                ].join('\n'),
          ].join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature:
          mode === 'coach'
            ? judgeStatus === 'passed'
              ? 0.2
              : judgeStatus === 'failed' || guidance
                ? 0.25
                : 0.3
            : guidance
              ? 0.2
              : 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt(language, mode, Boolean(guidance)) },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new BadGatewayException(await this.openAiFailureMessage(response));
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new BadGatewayException('OpenAI returned an empty response');
    }

    let parsed: {
      title?: string;
      notes?: string;
      time?: string;
      space?: string;
      description?: string;
      code?: string;
    };
    try {
      parsed = JSON.parse(content) as typeof parsed;
    } catch {
      throw new BadGatewayException('OpenAI returned invalid JSON');
    }

    const title =
      (parsed.title ?? (mode === 'coach' ? 'Coaching' : 'AI approach')).trim() ||
      (mode === 'coach' ? 'Coaching' : 'AI approach');
    const description = (parsed.description ?? '').trim();
    if (!description) {
      throw new BadGatewayException('OpenAI response missing description');
    }

    const rawCode = mode === 'full' ? (parsed.code ?? '').trim() : undefined;
    if (mode === 'full' && !rawCode) {
      throw new BadGatewayException('OpenAI response missing code for full mode');
    }

    const code = rawCode ? formatSourceCode(rawCode, language) : undefined;

    return {
      title,
      notes: parsed.notes?.trim() || undefined,
      time: formatComplexity(parsed.time),
      space: formatComplexity(parsed.space),
      description,
      code: code || undefined,
      language,
      model,
      mode,
      guidance: mode === 'coach' ? guidance : undefined,
    };
  }

  private normalizeGuidance(guidanceInput?: string): string | undefined {
    if (typeof guidanceInput !== 'string') return undefined;
    const trimmed = guidanceInput.trim().replace(/\s+/g, ' ');
    if (!trimmed) return undefined;
    // Keep prompts bounded for cost/latency; UI mirrors this limit.
    return trimmed.slice(0, 2000);
  }

  private normalizeCode(codeInput?: string): string | undefined {
    if (typeof codeInput !== 'string') return undefined;
    // Bound payload size for cost/latency.
    return codeInput.slice(0, 40_000);
  }

  private normalizeJudgeStatus(
    statusInput?: string,
  ): 'passed' | 'failed' | 'unknown' | undefined {
    if (statusInput === 'passed' || statusInput === 'failed' || statusInput === 'unknown') {
      return statusInput;
    }
    return undefined;
  }

  private normalizeJudgeDetail(detailInput?: string): string | undefined {
    if (typeof detailInput !== 'string') return undefined;
    const trimmed = detailInput.trim();
    if (!trimmed) return undefined;
    return trimmed.slice(0, 8000);
  }

  private apiKey(): string | undefined {
    const key = process.env.OPENAI_API_KEY?.trim();
    return key || undefined;
  }

  private model(): string {
    return process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';
  }

  /** Map OpenAI HTTP errors to short, safe UI messages (never echo secrets). */
  private async openAiFailureMessage(response: Response): Promise<string> {
    let code: string | undefined;
    let type: string | undefined;
    let message = '';
    try {
      const body = (await response.json()) as {
        error?: { code?: string | null; type?: string; message?: string };
      };
      code = body.error?.code ?? undefined;
      type = body.error?.type;
      message = body.error?.message?.trim() ?? '';
    } catch {
      /* ignore non-JSON bodies */
    }

    if (
      response.status === 429 &&
      (code === 'insufficient_quota' ||
        code === 'credit_balance_exhausted' ||
        /quota|credit/i.test(message))
    ) {
      return 'OpenAI has no credits left on this key. Add billing credits, then try again.';
    }
    if (response.status === 429) {
      return 'OpenAI rate limit hit. Wait a moment and try again.';
    }
    if (response.status === 401 || response.status === 403) {
      return 'OpenAI rejected the API key. Check OPENAI_API_KEY in api/.env.';
    }
    if (response.status === 404 || code === 'model_not_found') {
      return `OpenAI model "${this.model()}" was not found. Check OPENAI_MODEL in api/.env.`;
    }
    if (type === 'invalid_request_error' && message) {
      return `OpenAI request invalid: ${message.slice(0, 180)}`;
    }
    return `OpenAI request failed (${response.status})`;
  }
}
