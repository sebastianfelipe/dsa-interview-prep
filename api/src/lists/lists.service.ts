import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class ListsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  private listsDir() {
    return this.catalog.listsRoot;
  }

  listAll() {
    const dir = this.listsDir();
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        const coverage = this.withCoverage(data);
        return {
          id: data.id,
          title: data.title,
          difficulty: data.difficulty,
          url: data.url,
          total: coverage.problems.length,
          covered: coverage.problems.filter((p: { covered: boolean }) => p.covered).length,
        };
      });
  }

  getList(id: string) {
    const file = path.join(this.listsDir(), `${id}.json`);
    if (!fs.existsSync(file)) throw new NotFoundException(`List ${id} not found`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return this.withCoverage(data);
  }

  private withCoverage(data: {
    id: string;
    title: string;
    difficulty: string;
    url: string;
    leetcodeSlug?: string;
    problems: { leetcodeId: number; slug: string; title: string }[];
  }) {
    const problems = data.problems.map((p) => {
      const found = this.catalog.findProblemBySlug(p.slug);
      return {
        ...p,
        covered: Boolean(found?.hasSolution),
        topic: found?.topic ?? null,
        difficulty: found?.difficulty ?? data.difficulty,
      };
    });
    return {
      ...data,
      problems,
      covered: problems.filter((p) => p.covered).length,
      total: problems.length,
    };
  }
}
