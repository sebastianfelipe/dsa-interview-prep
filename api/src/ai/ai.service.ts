import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ProblemsService } from '../problems/problems.service';

export type AiExplainMode = 'hint' | 'full';

export interface AiExplainResult {
  title: string;
  notes?: string;
  description: string;
  time?: string;
  space?: string;
  code?: string;
  language: string;
  model: string;
  mode: AiExplainMode;
}

const SYSTEM_PROMPT = `You are a DSA interview tutor inside DSA Studio AI.
Given one coding problem, analyze recognition signals and propose one clear interview approach.

Rules:
- Teach patterns and walkthroughs; do not dump trivia.
- Use the examples in the problem statement when explaining.
- Prefer interview-ready TypeScript when code is requested.
- Do not claim affiliation with LeetCode or copy proprietary editorial text.
- Respond with a single JSON object only (no markdown fences).

JSON shape:
{
  "title": "short approach name",
  "notes": "one-line complexity or interview tip",
  "time": "e.g. O(n)",
  "space": "e.g. O(1)",
  "description": "markdown explanation: Approach, why it works, example walkthrough",
  "code": "TypeScript source (omit or empty string in hint mode)"
}`;

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

  async explain(topic: string, slug: string, mode: AiExplainMode = 'full'): Promise<AiExplainResult> {
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
      `Mode: ${mode === 'hint' ? 'HINT ONLY — explain the approach and walk an example, but do not include solution code (set code to "").' : 'FULL — include a complete TypeScript solution in code.'}`,
      `Topic: ${problem.topicTitle} (${topic})`,
      `Difficulty: ${problem.difficulty}`,
      `Slug: ${slug}`,
      `Title: ${problem.title}`,
      '',
      'Problem README:',
      problem.readme,
    ].join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
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

    const code = mode === 'full' ? (parsed.code ?? '').trim() : undefined;
    if (mode === 'full' && !code) {
      throw new BadGatewayException('OpenAI response missing code for full mode');
    }

    return {
      title,
      notes: parsed.notes?.trim() || undefined,
      time: parsed.time?.trim() || undefined,
      space: parsed.space?.trim() || undefined,
      description,
      code: code || undefined,
      language: 'typescript',
      model,
      mode,
    };
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
      // OpenAI messages here are usually about model/params, not secrets.
      return `OpenAI request invalid: ${message.slice(0, 180)}`;
    }
    return `OpenAI request failed (${response.status})`;
  }
}
