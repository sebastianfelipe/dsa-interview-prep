#!/usr/bin/env tsx
/**
 * CLI harness for the studio SQL judge.
 * Usage: tsx scripts/run-sql-cases.ts --solution <path.sql> --cases <path> --mode run|submit
 */
import * as fs from 'fs';
import * as path from 'path';
import { isSqlCaseFile } from '../lib/sql-cases';
import { judgeSqlSolution } from '../lib/sql-runner';

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const solution = arg('--solution');
  const casesPath = arg('--cases');
  const mode = (arg('--mode') ?? 'run') as 'run' | 'submit';

  if (!solution || !casesPath) {
    console.error('Usage: --solution <file.sql> --cases <file> --mode run|submit');
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

  const file = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  if (!isSqlCaseFile(file)) {
    console.error('Cases file is not a SQL case file (type must be "sql")');
    process.exit(2);
  }

  const learnerSql = fs.readFileSync(solution, 'utf8');
  const baseDir = path.dirname(path.resolve(casesPath));
  const result = await judgeSqlSolution(learnerSql, file, baseDir, mode);
  process.stdout.write(JSON.stringify(result));
  process.exit(result.passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
