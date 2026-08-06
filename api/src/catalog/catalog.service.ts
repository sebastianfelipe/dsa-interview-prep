import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemMeta {
  title: string;
  slug: string;
  leetcodeId?: number;
  difficulty: Difficulty;
  tags?: string[];
}

export interface ProblemSummary extends ProblemMeta {
  topic: string;
  topicTitle: string;
  hasSolution: boolean;
  hasTests: boolean;
  path: string;
}

export interface TopicSummary {
  id: string;
  title: string;
  patterns: { slug: string; title: string }[];
  problems: ProblemSummary[];
}

const ROOT = path.resolve(__dirname, '../../..');

@Injectable()
export class CatalogService {
  readonly root = ROOT;

  private topicDirs(): string[] {
    return fs
      .readdirSync(this.root, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d{2}-/.test(d.name))
      .map((d) => d.name)
      .sort();
  }

  private titleFromReadme(dir: string): string {
    const readme = path.join(dir, 'README.md');
    if (!fs.existsSync(readme)) return path.basename(dir);
    const first = fs.readFileSync(readme, 'utf8').split('\n').find((l) => l.startsWith('# '));
    return first ? first.replace(/^#\s+/, '').trim() : path.basename(dir);
  }

  getCatalog(): { topics: TopicSummary[]; difficulties: Difficulty[] } {
    const topics: TopicSummary[] = [];

    for (const topicId of this.topicDirs()) {
      const topicPath = path.join(this.root, topicId);
      const problemsDir = path.join(topicPath, 'problems');
      const patternsDir = path.join(topicPath, 'patterns');
      const problems: ProblemSummary[] = [];
      const patterns: { slug: string; title: string }[] = [];

      if (fs.existsSync(patternsDir)) {
        for (const file of fs.readdirSync(patternsDir).filter((f) => f.endsWith('.md'))) {
          const slug = file.replace(/\.md$/, '');
          const md = fs.readFileSync(path.join(patternsDir, file), 'utf8');
          const titleLine = md.split('\n').find((l) => l.startsWith('# '));
          patterns.push({ slug, title: titleLine ? titleLine.slice(2).trim() : slug });
        }
      }

      if (fs.existsSync(problemsDir)) {
        for (const entry of fs.readdirSync(problemsDir, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const problemPath = path.join(problemsDir, entry.name);
          const metaPath = path.join(problemPath, 'meta.json');
          if (!fs.existsSync(metaPath)) continue;
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as ProblemMeta;
          problems.push({
            ...meta,
            topic: topicId,
            topicTitle: this.titleFromReadme(topicPath),
            hasSolution: fs.existsSync(path.join(problemPath, 'solution.ts')),
            hasTests: fs.existsSync(path.join(problemPath, 'solution.test.ts')),
            path: path.relative(this.root, problemPath),
          });
        }
      }

      topics.push({
        id: topicId,
        title: this.titleFromReadme(topicPath),
        patterns,
        problems: problems.sort((a, b) => a.title.localeCompare(b.title)),
      });
    }

    return { topics, difficulties: ['Easy', 'Medium', 'Hard'] };
  }

  findProblem(topic: string, slug: string): ProblemSummary | null {
    const { topics } = this.getCatalog();
    const t = topics.find((x) => x.id === topic);
    return t?.problems.find((p) => p.slug === slug) ?? null;
  }

  findProblemBySlug(slug: string): ProblemSummary | null {
    const { topics } = this.getCatalog();
    for (const t of topics) {
      const p = t.problems.find((x) => x.slug === slug);
      if (p) return p;
    }
    return null;
  }

  problemDir(topic: string, slug: string): string {
    return path.join(this.root, topic, 'problems', slug);
  }
}
