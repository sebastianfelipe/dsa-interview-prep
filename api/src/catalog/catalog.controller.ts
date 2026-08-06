import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CatalogService, Difficulty } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  @Get()
  getCatalog(@Query('difficulty') difficulty?: Difficulty) {
    const data = this.catalog.getCatalog();
    if (!difficulty) return data;
    return {
      ...data,
      topics: data.topics
        .map((t) => ({
          ...t,
          problems: t.problems.filter((p) => p.difficulty === difficulty),
        }))
        .filter((t) => t.problems.length > 0 || t.patterns.length > 0),
    };
  }
}
