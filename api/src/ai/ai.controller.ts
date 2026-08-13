import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiExplainMode, AiService } from './ai.service';

class ExplainBodyDto {
  topic!: string;
  slug!: string;
  mode?: AiExplainMode;
  language?: string;
  /** Optional user direction for the approach, or a coach question on their code. */
  guidance?: string;
  /** Learner code for coach mode (ignored for hint/full). */
  code?: string;
  /** Optional studio judge result for this exact code buffer (coach mode). */
  judgeStatus?: 'passed' | 'failed' | 'unknown';
  /** Optional short judge summary, e.g. "3/3 cases". */
  judgeSummary?: string;
}

function normalizeMode(mode?: string): AiExplainMode {
  if (mode === 'hint' || mode === 'coach') return mode;
  return 'full';
}

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(@Inject(AiService) private readonly ai: AiService) {}

  @Get('status')
  @ApiOperation({ summary: 'Whether OpenAI is configured on the API (never returns the key)' })
  status() {
    return this.ai.status();
  }

  @Post('explain')
  @ApiOperation({
    summary:
      'Generate a hint, full walkthrough, or in-place coaching on the learner’s own code for one problem',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['topic', 'slug'],
      properties: {
        topic: { type: 'string', example: '02-hashing' },
        slug: { type: 'string', example: 'two-sum' },
        mode: { type: 'string', enum: ['hint', 'full', 'coach'], default: 'full' },
        language: {
          type: 'string',
          enum: ['typescript', 'python'],
          default: 'typescript',
          description: 'Language for code illustrations (hint/coach omit solution code)',
        },
        guidance: {
          type: 'string',
          description:
            'Optional learner direction (hint/full) or question about their code (coach)',
          example: 'Solve with two pointers in O(1) extra space; avoid hashing.',
        },
        code: {
          type: 'string',
          description: 'Current learner code for coach mode',
        },
        judgeStatus: {
          type: 'string',
          enum: ['passed', 'failed', 'unknown'],
          description: 'Studio judge result for this exact learner code buffer (coach mode)',
        },
        judgeSummary: {
          type: 'string',
          description: 'Optional short judge summary for the coach prompt',
          example: '3/3 cases passed',
        },
      },
    },
  })
  explain(@Body() body: ExplainBodyDto) {
    const mode = normalizeMode(body.mode);
    return this.ai.explain(
      body.topic,
      body.slug,
      mode,
      body.language,
      body.guidance,
      body.code,
      body.judgeStatus,
      body.judgeSummary,
    );
  }
}
