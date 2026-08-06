import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class ProblemsService {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}

  getProblem(topic: string, slug: string) {
    const summary = this.catalog.findProblem(topic, slug);
    if (!summary) throw new NotFoundException(`Problem ${topic}/${slug} not found`);
    const dir = this.catalog.problemDir(topic, slug);
    const readmePath = path.join(dir, 'README.md');
    const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
    return { ...summary, readme };
  }

  getSolution(topic: string, slug: string) {
    const dir = this.catalog.problemDir(topic, slug);
    const solutionPath = path.join(dir, 'solution.ts');
    if (!fs.existsSync(solutionPath)) throw new NotFoundException('No solution file');
    return {
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
