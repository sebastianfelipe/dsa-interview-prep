import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CatalogService, Difficulty } from './catalog.service';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  @Get()
  @ApiOperation({ summary: 'List topics, patterns, and problems' })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['Easy', 'Medium', 'Hard'],
    description: 'Optional difficulty filter for problems',
  })
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
