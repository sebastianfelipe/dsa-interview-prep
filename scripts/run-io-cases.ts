#!/usr/bin/env tsx
/**
 * CLI harness for the studio I/O judge.
 * Usage: tsx scripts/run-io-cases.ts --solution <path> --cases <path> --mode run|submit
 */
import * as fs from 'fs';
import type { CaseFile } from '../lib/cases';
import { judgeSolution } from '../lib/io-runner';

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const solution = arg('--solution');
  const casesPath = arg('--cases');
  const mode = (arg('--mode') ?? 'run') as 'run' | 'submit';

  if (!solution || !casesPath) {
    console.error('Usage: --solution <file> --cases <file> --mode run|submit');
    process.exit(2);
  }
  if (!fs.existsSync(solution)) {
    console.error(`Solution not found: ${solution}`);
    process.exit(2);
  }
  if (!fs.existsSync(casesPath)) {
    console.error(`Cases not found: ${casesPath}`);
    process.exit(2);
  }

  const file = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as CaseFile;
  const result = await judgeSolution(solution, file, mode);
  process.stdout.write(JSON.stringify(result));
  process.exit(result.passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
