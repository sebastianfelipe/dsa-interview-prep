import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import type { CaseFile } from './cases';
import { runCaseFile } from './io-runner';

/** Thin Vitest bridge: assert cases.json against the imported solution module. */
export function testSolutionCases(problemDir: string, mod: Record<string, unknown>) {
  const casesPath = path.join(problemDir, 'cases.json');
  if (!fs.existsSync(casesPath)) {
    throw new Error(`Missing cases.json in ${problemDir}`);
  }
  const file = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as CaseFile;

  describe(file.exportName, () => {
    describe('examples', () => {
      it('all example cases pass', () => {
        const result = runCaseFile(mod, file, 'run');
        const failed = result.cases.filter((c) => c.status !== 'passed');
        expect(failed, JSON.stringify(failed, null, 2)).toEqual([]);
      });
    });

    describe('edge cases', () => {
      it('all submit cases pass', () => {
        const result = runCaseFile(mod, file, 'submit');
        const failed = result.cases.filter((c) => c.status !== 'passed');
        expect(failed, JSON.stringify(failed, null, 2)).toEqual([]);
      });
    });
  });
}
