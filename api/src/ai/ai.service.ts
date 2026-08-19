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
}

function sqlSystemPrompt(mode: AiExplainMode, hasGuidance: boolean): string {
  if (mode === 'coach') {
    return `You are a SQL interview coach inside DSA Studio AI.
The learner is writing their own PostgreSQL query for a database problem. Coach them in place — do not write the query for them.

Rules:
- Review the learner's current query, optional question, and any JUDGE / FAILING CASES block.
- Failing cases include the seeded input tables, the EXPECTED result set, and their query's ACTUAL result set (or the SQL error).
- Lead with what is already correct (right tables, right join, right grouping) before any critique.
- Do NOT invent bugs without concrete evidence in their query or the failing cases.
- If their query is correct, say so clearly; offer at most light polish (readability, alias names) — not a fault-finding mission.
- When JUDGE STATUS says PASSED for this exact query: congratulate; do not invent failures.
- When JUDGE STATUS says FAILED (or they ask what to fix / why it fails):
  - Diagnose clause by clause and be SPECIFIC to THEIR query: the join type or join key, WHERE vs HAVING, a filter that belongs in the LEFT JOIN's ON condition, GROUP BY columns, COUNT(*) vs COUNT(column), NULL handling, integer division, window frame, ORDER BY, or output column aliases (result column names must match the expected header exactly).
  - Walk 1 failing case: which rows their query keeps or drops (or what value it computes) vs what the expected result shows, then the exact clause to change and why.
  - If ACTUAL is a SQL error, explain the error message concretely (e.g. "column must appear in GROUP BY", "column does not exist" often means a bad alias or case-folding) and the one change that fixes it.
  - One primary bug at a time. End with a single concrete next step.
- Short SQL fragments (1–3 lines) are OK to clarify the fix — never the full query.
- If their query is empty, help them start: which tables to read, what join or grouping the problem needs, and the skeleton (SELECT … FROM … ), without writing the whole answer.
- The dialect is PostgreSQL; mention MySQL equivalents only if they used MySQL-only syntax (DATEDIFF, IFNULL) that caused an error.
- Leave "time" and "space" as empty strings; they do not apply to SQL problems.
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences).

JSON shape:
{
  "title": "short coaching headline naming the issue or win",
  "notes": "one-line tip",
  "time": "",
  "space": "",
  "description": "markdown: what's working; then concrete clause-level diagnosis (query + failing case if any); one next step — no full solution",
  "code": ""
}`;
  }

  const guidanceRules = hasGuidance
    ? `- CRITICAL: The user message includes LEARNER GUIDANCE. That guidance is a hard requirement for this response.
- Build the approach, title, description, and query around that guidance (e.g. "use a window function", "no subqueries", "self-join").
- If the guidance is impossible or a poor fit, say so in the first paragraph, then still get as close as practical and explain the tradeoff.
- The title must name the guided approach.
- Start the description with a short line: **Guidance:** <restated learner request>.`
    : `- If the learner provides approach guidance, follow it when designing the query.`;

  return `You are a SQL interview tutor inside DSA Studio AI.
Given one database problem, teach the learner how to construct the query step by step.

Rules:
- Lead with recognition: what kind of SQL problem this is (filtering / join / anti-join / aggregation / window function / subquery) and the signal in the problem statement.
- Build the query incrementally: which tables and join strategy → filters (and whether they belong in ON or WHERE) → grouping and aggregates or window definition → HAVING → final SELECT with the exact output column aliases the problem asks for → ORDER BY if required.
- Walk the problem's example: show how the intermediate result set evolves after the key step (e.g. after the join or the grouping).
- Use PostgreSQL syntax. Note a MySQL difference in one short line only when it commonly trips people up (e.g. DATEDIFF vs date subtraction, IFNULL vs COALESCE, integer division).
- Output column names must match the expected result exactly — call out required aliases.
${guidanceRules}
- Format SQL with real newlines and indentation, one clause per line.
- Leave "time" and "space" as empty strings; they do not apply to SQL problems.
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences).

JSON shape:
{
  "title": "short approach name${hasGuidance ? ' that reflects the learner guidance' : ''} (e.g. LEFT JOIN anti-join, DENSE_RANK window)",
  "notes": "one-line takeaway or interview tip",
  "time": "",
  "space": "",
  "description": "markdown: recognition, clause-by-clause construction, example walkthrough",
  "code": "complete PostgreSQL query (omit or empty string in hint mode)"
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
    const judgeStatus = this.normalizeJudgeStatus(judgeStatusInput);
    const judgeSummary = this.normalizeGuidance(judgeSummaryInput);
    const judgeDetail = this.normalizeJudgeDetail(judgeDetailInput);
    const apiKey = this.apiKey();
    if (!apiKey) {
      throw new ServiceUnavailableException('AI is not configured (missing OPENAI_API_KEY)');
    }

    let problem;
    try {
      problem = this.problems.getProblem(topic, slug);
    } catch {
      throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    }

    const model = this.model();
    const modeLine =
      mode === 'hint'
        ? language === 'sql'
          ? 'HINT ONLY — teach how to construct the query (tables, join/group/window, aliases); do not include the full query (set code to "").'
          : 'HINT ONLY — explain the approach and walk an example in language-agnostic terms; do not include solution code (set code to "").'
        : mode === 'coach'
          ? judgeStatus === 'passed'
            ? 'COACH ONLY — their current code PASSED studio tests; affirm what works; light polish only; do not invent bugs; set code to "".'
            : judgeStatus === 'failed'
              ? 'COACH ONLY — code FAILED tests; diagnose the concrete bug using FAILING CASES + their code; one specific next fix; no full rewrite; set code to "".'
              : 'COACH ONLY — guide on their current code; be specific when they ask what to fix; do not invent bugs; no full rewrite; set code to "".'
          : language === 'sql'
            ? 'FULL — teach how to construct the query step by step, then include the complete PostgreSQL query in code.'
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
              ? `PASSED — this exact code buffer already passed the studio judge${judgeSummary ? ` (${judgeSummary})` : ''}. Treat it as a working solution. Do not claim it fails or invent bugs.`
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
                  'Answer this question directly. If they ask what to fix / why it fails / how to make it work, lead with a concrete diagnosis of THEIR code (and failing cases if present), not a generic hint.',
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
