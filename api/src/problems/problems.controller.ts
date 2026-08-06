import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(@Inject(ProblemsService) private readonly problems: ProblemsService) {}

  @Get(':topic/:slug')
  getProblem(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getProblem(topic, slug);
  }

  @Get(':topic/:slug/solution')
  getSolution(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.getSolution(topic, slug);
  }

  @Post(':topic/:slug/run')
  runTests(@Param('topic') topic: string, @Param('slug') slug: string) {
    return this.problems.runTests(topic, slug);
  }
}
