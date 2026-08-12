import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiExplainMode, AiService } from './ai.service';

class ExplainBodyDto {
  topic!: string;
  slug!: string;
  mode?: AiExplainMode;
  language?: string;
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
    summary: 'Generate an on-demand approach (hint) or full solution walkthrough for one problem',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['topic', 'slug'],
      properties: {
        topic: { type: 'string', example: '02-hashing' },
        slug: { type: 'string', example: 'two-sum' },
        mode: { type: 'string', enum: ['hint', 'full'], default: 'full' },
        language: {
          type: 'string',
          enum: ['typescript', 'python'],
          default: 'typescript',
          description: 'Language for code illustrations (hint mode still omits code)',
        },
      },
    },
  })
  explain(@Body() body: ExplainBodyDto) {
    const mode: AiExplainMode = body.mode === 'hint' ? 'hint' : 'full';
    return this.ai.explain(body.topic, body.slug, mode, body.language);
  }
}
