import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
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
import type { RunBody, RunMode, RunResultDto } from './run-dto';
import { buildTypescriptStarter } from './starter-code';

/** Parse judge CLI stdout. npm noise goes to stderr; never slice from the last `{`. */
function parseJudgeStdout(stdout: string, stderr: string): unknown {
  const trimmed = stdout.trim();
  if (!trimmed) {
    throw new Error(stderr.trim() || 'Judge produced no JSON output');
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    // Rare: leading non-JSON on stdout — take the first top-level object.
    const start = trimmed.indexOf('{');
    if (start < 0) {
      throw new Error(stderr.trim() || 'Judge produced no JSON output');
    }
    const slice = trimmed.slice(start);
    try {
      return JSON.parse(slice);
    } catch {
      throw new Error(stderr.trim() || `Invalid judge JSON: ${trimmed.slice(0, 400)}`);
    }
  }
}

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
    return {
      ...summary,
      readme,
      solutions,
      languages,
      starterCode: this.buildStarterCode(dir),
    };
  }

  private buildStarterCode(dir: string): string {
    const casesPath = path.join(dir, 'cases.json');
    const solutionPath = path.join(dir, 'solution.ts');
    let exportName: string | undefined;
    let type: string | undefined;
    let argNames: string[] | undefined;
    if (fs.existsSync(casesPath)) {
      try {
        const file = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as {
          type?: string;
          exportName?: string;
          argNames?: string[];
        };
        exportName = file.exportName;
        type = file.type;
        argNames = file.argNames;
      } catch {
        /* ignore malformed cases */
      }
    }
    const solutionCode = fs.existsSync(solutionPath)
      ? fs.readFileSync(solutionPath, 'utf8')
      : undefined;
    return buildTypescriptStarter({ solutionCode, exportName, type, argNames });
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

  getCases(topic: string, slug: string) {
    const dir = this.catalog.problemDir(topic, slug);
    const casesPath = path.join(dir, 'cases.json');
    if (!fs.existsSync(casesPath)) throw new NotFoundException('No cases for this problem');
    const file = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as {
      type: string;
      exportName: string;
      argNames?: string[];
      examples: unknown[];
      edgeCases: unknown[];
    };
    return {
      type: file.type,
      exportName: file.exportName,
      argNames: file.argNames,
      examples: file.examples,
      edgeCaseCount: Array.isArray(file.edgeCases) ? file.edgeCases.length : 0,
    };
  }

  async runTests(topic: string, slug: string, body: RunBody): Promise<RunResultDto> {
    const mode: RunMode = body.mode === 'submit' ? 'submit' : 'run';
    const language = normalizeCodeLanguage(body.language, 'typescript');
    if (language !== 'typescript') {
      throw new BadRequestException('Only TypeScript can be judged right now');
    }
    if (typeof body.code !== 'string' || !body.code.trim()) {
      throw new BadRequestException('code is required');
    }

    const dir = this.catalog.problemDir(topic, slug);
    if (!fs.existsSync(dir)) throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    const casesPath = path.join(dir, 'cases.json');
    if (!fs.existsSync(casesPath)) throw new NotFoundException('No cases for this problem');

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-judge-'));
    const solutionPath = path.join(dir, '.judge-solution.ts');
    const started = Date.now();

    try {
      fs.writeFileSync(solutionPath, body.code, 'utf8');
      const scriptPath = path.join(this.catalog.root, 'scripts/run-io-cases.ts');
      const raw = await this.spawnJson(scriptPath, solutionPath, casesPath, mode);
      if (raw && typeof raw === 'object' && 'summary' in raw) {
        return { ...(raw as RunResultDto), durationMs: Date.now() - started };
      }
      return {
        passed: false,
        mode,
        summary: { total: 0, passed: 0, failed: 1 },
        cases: [
          {
            id: 'runner',
            status: 'error',
            inputs: null,
            expected: null,
            error: 'Judge returned no result',
          },
        ],
        durationMs: Date.now() - started,
        stdout: typeof raw === 'string' ? raw : undefined,
      };
    } catch (err) {
      return {
        passed: false,
        mode,
        summary: { total: 1, passed: 0, failed: 1 },
        cases: [
          {
            id: 'runner',
            status: 'error',
            inputs: null,
            expected: null,
            error: err instanceof Error ? err.message : String(err),
          },
        ],
        durationMs: Date.now() - started,
      };
    } finally {
      try {
        if (fs.existsSync(solutionPath)) fs.unlinkSync(solutionPath);
      } catch {
        /* ignore */
      }
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  }

  private spawnJson(
    scriptPath: string,
    solutionPath: string,
    casesPath: string,
    mode: RunMode,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        process.platform === 'win32' ? 'npx.cmd' : 'npx',
        [
          'tsx',
          scriptPath,
          '--solution',
          solutionPath,
          '--cases',
          casesPath,
          '--mode',
          mode,
        ],
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
      child.on('error', reject);
      child.on('close', () => {
        try {
          resolve(parseJudgeStdout(stdout, stderr));
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
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
