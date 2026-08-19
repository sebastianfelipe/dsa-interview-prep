import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';
import type { RunBody } from './run-dto';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(@Inject(ProblemsService) private readonly problems: ProblemsService) {}

  @Get(':topic/:slug')
  @ApiOperation({ summary: 'Get problem metadata, README, and solution list' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  getProblem(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getProblem(topic, slug);
  }

  @Get(':topic/:slug/cases')
  @ApiOperation({
    summary: 'Public example I/O cases (edge cases are hidden; count only)',
  })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  getCases(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getCases(topic, slug);
  }

  @Get(':topic/:slug/solutions')
  @ApiOperation({ summary: 'List available solutions for a problem' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  listSolutions(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.listSolutions(topic, slug);
  }

  @Get(':topic/:slug/solution')
  @ApiOperation({ summary: 'Reveal solution source' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Solution id from solutions.json (default: recommended)',
    example: 'yours',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Code language (typescript | python | sql). Falls back to an available implementation.',
    example: 'sql',
  })
  getSolution(
    @Param('topic') topic: string,
    @Param('slug') slug: string,
    @Query('id') id?: string,
    @Query('language') language?: string,
  ) {
    return this.problems.getSolution(topic, slug, id ?? 'recommended', language);
  }

  @Post(':topic/:slug/run')
  @ApiOperation({
    summary: 'Run learner code against example cases (TypeScript I/O or SQL query)',
  })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code'],
      properties: {
        code: { type: 'string' },
        language: { type: 'string', example: 'typescript' },
        mode: { type: 'string', enum: ['run', 'submit'], default: 'run' },
      },
    },
  })
  runTests(
    @Param('topic') topic: string,
    @Param('slug') slug: string,
    @Body() body: RunBody,
  ) {
    return this.problems.runTests(topic, slug, { ...body, mode: body.mode ?? 'run' });
  }

  @Post(':topic/:slug/submit')
  @ApiOperation({
    summary: 'Submit learner code against examples + edge cases (TypeScript I/O or SQL query)',
  })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code'],
      properties: {
        code: { type: 'string' },
        language: { type: 'string', example: 'typescript' },
      },
    },
  })
  submit(
    @Param('topic') topic: string,
    @Param('slug') slug: string,
    @Body() body: RunBody,
  ) {
    return this.problems.runTests(topic, slug, { ...body, mode: 'submit' });
  }
}
