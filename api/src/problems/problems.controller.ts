import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';

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

  @Get(':topic/:slug/solutions')
  @ApiOperation({ summary: 'List available solutions for a problem' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  listSolutions(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.listSolutions(topic, slug);
  }

  @Get(':topic/:slug/solution')
  @ApiOperation({ summary: 'Reveal TypeScript solution source' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Solution id from solutions.json (default: recommended)',
    example: 'yours',
  })
  getSolution(
    @Param('topic') topic: string,
    @Param('slug') slug: string,
    @Query('id') id?: string,
  ) {
    return this.problems.getSolution(topic, slug, id ?? 'recommended');
  }

  @Post(':topic/:slug/run')
  @ApiOperation({ summary: 'Run Vitest suite for the recommended solution.ts' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  runTests(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.runTests(topic, slug);
  }
}
