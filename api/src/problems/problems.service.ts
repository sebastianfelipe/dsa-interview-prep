import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { CatalogService } from '../catalog/catalog.service';
import {
  CODE_LANGUAGES,
  type CodeLanguage,
  languageFromFilename,
  normalizeCodeLanguage,
  swapLanguageExtension,
} from '../code-language';

interface RawSolutionEntry {
  id: string;
  title: string;
  file?: string;
  implementations?: Partial<Record<CodeLanguage, string>>;
  source: 'repo' | 'yours' | string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
}

export interface SolutionEntry {
  id: string;
  title: string;
  /** Preferred / primary file (back-compat). */
  file: string;
  languages: CodeLanguage[];
  implementations: Partial<Record<CodeLanguage, string>>;
  source: 'repo' | 'yours' | string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
}

export interface SolutionDetail {
  id: string;
  title: string;
  source: string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
  language: CodeLanguage;
  languages: CodeLanguage[];
  code: string;
  hasCode: boolean;
  path: string | null;
}

@Injectable()
export class ProblemsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  listSolutions(topic: string, slug: string): SolutionEntry[] {
    const dir = this.catalog.problemDir(topic, slug);
    if (!fs.existsSync(dir)) throw new NotFoundException(`Problem ${topic}/${slug} not found`);

    const catalogPath = path.join(dir, 'solutions.json');
    if (fs.existsSync(catalogPath)) {
      const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as {
        solutions: RawSolutionEntry[];
      };
      return data.solutions
        .map((raw) => this.normalizeEntry(dir, raw))
        .filter((s) => s.languages.length > 0);
    }

    return this.discoverDefaultEntries(dir);
  }

  getProblem(topic: string, slug: string) {
    const summary = this.catalog.findProblem(topic, slug);
    if (!summary) throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    const dir = this.catalog.problemDir(topic, slug);
    const readmePath = path.join(dir, 'README.md');
    const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
    const solutions = this.listSolutions(topic, slug);
    const languages = this.collectLanguages(solutions);
    return { ...summary, readme, solutions, languages };
  }

  getSolution(
    topic: string,
    slug: string,
    solutionId = 'recommended',
    language?: string,
  ): SolutionDetail {
    const solutions = this.listSolutions(topic, slug);
    const entry =
      solutions.find((s) => s.id === solutionId) ??
      solutions.find((s) => s.id === 'recommended') ??
      solutions[0];
    if (!entry) throw new NotFoundException('No solution file');

    const resolved = normalizeCodeLanguage(
      language,
      entry.implementations.typescript
        ? 'typescript'
        : entry.languages[0] ?? 'typescript',
    );
    const relative = entry.implementations[resolved];
    const dir = this.catalog.problemDir(topic, slug);
    const solutionPath = relative ? path.join(dir, relative) : null;
    const hasCode = Boolean(solutionPath && fs.existsSync(solutionPath));

    return {
      id: entry.id,
      title: entry.title,
      source: entry.source,
      notes: entry.notes,
      description: entry.description,
      time: entry.time,
      space: entry.space,
      language: resolved,
      languages: entry.languages,
      code: hasCode && solutionPath ? fs.readFileSync(solutionPath, 'utf8') : '',
      hasCode,
      path: hasCode && solutionPath ? path.relative(this.catalog.root, solutionPath) : null,
    };
  }

  async runTests(topic: string, slug: string): Promise<{
    passed: boolean;
    exitCode: number;
    stdout: string;
    stderr: string;
    durationMs: number;
  }> {
    const dir = this.catalog.problemDir(topic, slug);
    const testFile = path.join(dir, 'solution.test.ts');
    if (!fs.existsSync(testFile)) throw new NotFoundException('No tests for this problem');

    const configPath = path.join(this.catalog.root, 'vitest.solutions.config.ts');
    const started = Date.now();

    return new Promise((resolve) => {
      const child = spawn(
        process.platform === 'win32' ? 'npx.cmd' : 'npx',
        ['vitest', 'run', '--config', configPath, testFile],
        {
          cwd: this.catalog.root,
          env: { ...process.env, FORCE_COLOR: '0' },
          timeout: 60_000,
        },
      );

      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => (stdout += d.toString()));
      child.stderr.on('data', (d) => (stderr += d.toString()));
      child.on('close', (code) => {
        resolve({
          passed: code === 0,
          exitCode: code ?? 1,
          stdout,
          stderr,
          durationMs: Date.now() - started,
        });
      });
      child.on('error', (err) => {
        resolve({
          passed: false,
          exitCode: 1,
          stdout,
          stderr: stderr + '\n' + String(err),
          durationMs: Date.now() - started,
        });
      });
    });
  }

  private normalizeEntry(dir: string, raw: RawSolutionEntry): SolutionEntry {
    const implementations: Partial<Record<CodeLanguage, string>> = {};

    if (raw.implementations) {
      for (const lang of CODE_LANGUAGES) {
        const file = raw.implementations[lang];
        if (file && fs.existsSync(path.join(dir, file))) {
          implementations[lang] = file;
        }
      }
    }

    if (raw.file) {
      const lang = languageFromFilename(raw.file);
      if (lang && !implementations[lang] && fs.existsSync(path.join(dir, raw.file))) {
        implementations[lang] = raw.file;
      }
    }

    const seeds = [
      ...Object.values(implementations),
      ...(raw.file ? [raw.file] : []),
    ];
    for (const seed of seeds) {
      for (const lang of CODE_LANGUAGES) {
        if (implementations[lang]) continue;
        const candidate = swapLanguageExtension(seed, lang);
        if (fs.existsSync(path.join(dir, candidate))) {
          implementations[lang] = candidate;
        }
      }
    }

    const languages = CODE_LANGUAGES.filter((lang) => Boolean(implementations[lang]));
    const file =
      implementations.typescript ??
      implementations.python ??
      raw.file ??
      Object.values(implementations)[0] ??
      '';

    return {
      id: raw.id,
      title: raw.title,
      file,
      languages,
      implementations,
      source: raw.source,
      notes: raw.notes,
      description: raw.description,
      time: raw.time,
      space: raw.space,
    };
  }

  private discoverDefaultEntries(dir: string): SolutionEntry[] {
    const implementations: Partial<Record<CodeLanguage, string>> = {};
    if (fs.existsSync(path.join(dir, 'solution.ts'))) implementations.typescript = 'solution.ts';
    if (fs.existsSync(path.join(dir, 'solution.py'))) implementations.python = 'solution.py';
    const languages = CODE_LANGUAGES.filter((lang) => Boolean(implementations[lang]));
    if (languages.length === 0) return [];

    return [
      {
        id: 'recommended',
        title: 'Recommended',
        file: implementations.typescript ?? implementations.python ?? 'solution.ts',
        languages,
        implementations,
        source: 'repo',
      },
    ];
  }

  private collectLanguages(solutions: SolutionEntry[]): CodeLanguage[] {
    const set = new Set<CodeLanguage>();
    for (const s of solutions) {
      for (const lang of s.languages) set.add(lang);
    }
    // Always advertise supported studio languages so the picker stays stable.
    for (const lang of CODE_LANGUAGES) set.add(lang);
    return CODE_LANGUAGES.filter((lang) => set.has(lang));
  }
}
