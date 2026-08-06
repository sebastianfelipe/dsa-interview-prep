import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(@Inject(ProblemsService) private readonly problems: ProblemsService) {}

  @Get(':topic/:slug')
  @ApiOperation({ summary: 'Get problem metadata and README markdown' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  getProblem(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getProblem(topic, slug);
  }

  @Get(':topic/:slug/solution')
  @ApiOperation({ summary: 'Reveal TypeScript solution source' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  getSolution(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getSolution(topic, slug);
  }

  @Post(':topic/:slug/run')
  @ApiOperation({ summary: 'Run Vitest suite for the problem solution' })
  @ApiParam({ name: 'topic', example: '02-hashing' })
  @ApiParam({ name: 'slug', example: 'two-sum' })
  runTests(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.runTests(topic, slug);
  }
}
