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

export type AiExplainMode = 'hint' | 'full';

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

function systemPrompt(language: CodeLanguage, hasGuidance: boolean): string {
  const label = LANGUAGE_LABELS[language];
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
  ): Promise<AiExplainResult> {
    const language = normalizeCodeLanguage(languageInput);
    const label = LANGUAGE_LABELS[language];
    const guidance = this.normalizeGuidance(guidanceInput);
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
    const userPrompt = [
      `Mode: ${mode === 'hint' ? 'HINT ONLY — explain the approach and walk an example in language-agnostic terms; do not include solution code (set code to "").' : `FULL — teach the approach first, then include a complete ${label} illustration of that approach in code.`}`,
      `Code language for the illustration: ${label}`,
      `Topic: ${problem.topicTitle} (${topic})`,
      `Difficulty: ${problem.difficulty}`,
      `Slug: ${slug}`,
      `Title: ${problem.title}`,
      '',
      'Problem README:',
      problem.readme,
      guidance
        ? [
            '',
            '=== LEARNER GUIDANCE (REQUIRED) ===',
            'Follow this as the primary approach for title, description, and code.',
            'Do not fall back to a more common default approach unless this guidance is impossible.',
            guidance,
            '=== END LEARNER GUIDANCE ===',
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
        // Stay closer to the requested approach when the learner gave direction.
        temperature: guidance ? 0.2 : 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt(language, Boolean(guidance)) },
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

    const title = (parsed.title ?? 'AI approach').trim() || 'AI approach';
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
