import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { CatalogService } from '../catalog/catalog.service';

export interface SolutionEntry {
  id: string;
  title: string;
  file: string;
  source: 'repo' | 'yours' | string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
}

@Injectable()
export class ProblemsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  listSolutions(topic: string, slug: string): SolutionEntry[] {
    const dir = this.catalog.problemDir(topic, slug);
    if (!fs.existsSync(dir)) throw new NotFoundException(`Problem ${topic}/${slug} not found`);

    const catalogPath = path.join(dir, 'solutions.json');
    if (fs.existsSync(catalogPath)) {
      const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as { solutions: SolutionEntry[] };
      return data.solutions.filter((s) => fs.existsSync(path.join(dir, s.file)));
    }

    if (fs.existsSync(path.join(dir, 'solution.ts'))) {
      return [
        {
          id: 'recommended',
          title: 'Recommended',
          file: 'solution.ts',
          source: 'repo',
        },
      ];
    }

    return [];
  }

  getProblem(topic: string, slug: string) {
    const summary = this.catalog.findProblem(topic, slug);
    if (!summary) throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    const dir = this.catalog.problemDir(topic, slug);
    const readmePath = path.join(dir, 'README.md');
    const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
    const solutions = this.listSolutions(topic, slug);
    return { ...summary, readme, solutions };
  }

  getSolution(topic: string, slug: string, solutionId = 'recommended') {
    const solutions = this.listSolutions(topic, slug);
    const entry =
      solutions.find((s) => s.id === solutionId) ??
      solutions.find((s) => s.id === 'recommended') ??
      solutions[0];
    if (!entry) throw new NotFoundException('No solution file');

    const dir = this.catalog.problemDir(topic, slug);
    const solutionPath = path.join(dir, entry.file);
    if (!fs.existsSync(solutionPath)) throw new NotFoundException('No solution file');

    return {
      id: entry.id,
      title: entry.title,
      source: entry.source,
      notes: entry.notes,
      description: entry.description,
      time: entry.time,
      space: entry.space,
      language: 'typescript',
      code: fs.readFileSync(solutionPath, 'utf8'),
      path: path.relative(this.catalog.root, solutionPath),
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
}
