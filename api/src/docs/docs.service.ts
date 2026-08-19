import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CatalogService } from '../catalog/catalog.service';

const RESOURCE_PREFIXES = [
  'resources/study-plans',
  'resources/sql',
  'resources/cheat-sheets',
  'resources/patterns',
  'resources/templates',
];

@Injectable()
export class DocsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  index() {
    const sections: { id: string; title: string; docs: { path: string; title: string }[] }[] = [];

    const fundamentals = 'topics/00-fundamentals';
    const fundamentalsDir = path.join(this.catalog.root, fundamentals);
    if (fs.existsSync(fundamentalsDir)) {
      const docs: { path: string; title: string }[] = [];
      this.walkMd(fundamentalsDir, fundamentals, docs);
      sections.push({ id: fundamentals, title: 'Fundamentals', docs });
    }

    for (const prefix of RESOURCE_PREFIXES) {
      const dir = path.join(this.catalog.root, prefix);
      if (!fs.existsSync(dir)) continue;
      const docs: { path: string; title: string }[] = [];
      this.walkMd(dir, prefix, docs);
      sections.push({
        id: prefix,
        title: this.pretty(prefix.replace(/^resources\//, '')),
        docs,
      });
    }

    const { topics } = this.catalog.getCatalog();
    for (const topic of topics) {
      if (!topic.patterns.length) continue;
      sections.push({
        id: `topics/${topic.id}/patterns`,
        title: `${topic.title} — Patterns`,
        docs: topic.patterns.map((p) => ({
          path: `topics/${topic.id}/patterns/${p.slug}`,
          title: p.title,
        })),
      });
    }

    return { sections };
  }

  getDoc(docPath: string) {
    const normalized = docPath.replace(/\\/g, '/').replace(/^\/+/, '');
    const allowed =
      RESOURCE_PREFIXES.some((p) => normalized === p || normalized.startsWith(p + '/')) ||
      normalized === 'topics/00-fundamentals' ||
      normalized.startsWith('topics/00-fundamentals/') ||
      /^topics\/\d{2}-[^/]+\/(patterns|README)/.test(normalized) ||
      /^topics\/\d{2}-[^/]+$/.test(normalized);

    if (!allowed || normalized.includes('..')) {
      throw new NotFoundException('Doc not found');
    }

    let file = path.join(this.catalog.root, normalized);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'README.md');
    } else if (!file.endsWith('.md')) {
      file = `${file}.md`;
    }

    if (!fs.existsSync(file)) throw new NotFoundException('Doc not found');
    return {
      path: normalized,
      title: this.titleFromFile(file),
      markdown: fs.readFileSync(file, 'utf8'),
    };
  }

  private walkMd(dir: string, prefix: string, out: { path: string; title: string }[]) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.walkMd(full, path.join(prefix, entry.name), out);
      } else if (entry.name.endsWith('.md')) {
        const rel = path.join(prefix, entry.name.replace(/\.md$/, '')).replace(/\\/g, '/');
        out.push({ path: rel, title: this.titleFromFile(full) });
      }
    }
  }

  private titleFromFile(file: string) {
    const md = fs.readFileSync(file, 'utf8');
    const line = md.split('\n').find((l) => l.startsWith('# '));
    return line ? line.slice(2).trim() : path.basename(file, '.md');
  }

  private pretty(id: string) {
    if (id === 'sql') return 'SQL · how to query';
    return id
      .replace(/^\d+-/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
