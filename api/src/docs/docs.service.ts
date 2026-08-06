import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CatalogService } from '../catalog/catalog.service';

const ALLOWED_PREFIXES = [
  '00-fundamentals',
  'study-plans',
  'cheat-sheets',
  'patterns',
  'templates',
];

@Injectable()
export class DocsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  index() {
    const sections: { id: string; title: string; docs: { path: string; title: string }[] }[] = [];
    for (const prefix of ALLOWED_PREFIXES) {
      const dir = path.join(this.catalog.root, prefix);
      if (!fs.existsSync(dir)) continue;
      const docs: { path: string; title: string }[] = [];
      this.walkMd(dir, prefix, docs);
      sections.push({
        id: prefix,
        title: this.pretty(prefix),
        docs,
      });
    }

    const { topics } = this.catalog.getCatalog();
    for (const topic of topics) {
      if (!topic.patterns.length) continue;
      sections.push({
        id: `${topic.id}/patterns`,
        title: `${topic.title} — Patterns`,
        docs: topic.patterns.map((p) => ({
          path: `${topic.id}/patterns/${p.slug}`,
          title: p.title,
        })),
      });
    }

    return { sections };
  }

  getDoc(docPath: string) {
    const normalized = docPath.replace(/\\/g, '/').replace(/^\/+/, '');
    const allowed =
      ALLOWED_PREFIXES.some((p) => normalized === p || normalized.startsWith(p + '/')) ||
      /^\d{2}-[^/]+\/(patterns|README)/.test(normalized) ||
      /^\d{2}-[^/]+$/.test(normalized);

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
    return id
      .replace(/^\d+-/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
