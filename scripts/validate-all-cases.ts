import * as fs from 'fs';
import * as path from 'path';
import { judgeSolution } from '../lib/io-runner';
import type { CaseFile } from '../lib/cases';

async function main() {
  const root = path.join(process.cwd(), 'topics');
  let fail = 0;
  let ok = 0;
  const failures: string[] = [];

  for (const topic of fs.readdirSync(root).sort()) {
    const problems = path.join(root, topic, 'problems');
    if (!fs.existsSync(problems)) continue;
    for (const slug of fs.readdirSync(problems).sort()) {
      const dir = path.join(problems, slug);
      const casesPath = path.join(dir, 'cases.json');
      const sol = path.join(dir, 'solution.ts');
      if (!fs.existsSync(casesPath) || !fs.existsSync(sol)) continue;
      const file = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as CaseFile;
      const result = await judgeSolution(path.resolve(sol), file, 'submit');
      if (result.passed) {
        ok += 1;
      } else {
        fail += 1;
        const first = result.cases.find((c) => c.status !== 'passed');
        failures.push(`${topic}/${slug}: ${first?.id} ${first?.error || first?.status}`);
      }
    }
  }

  console.log(JSON.stringify({ ok, fail, failures }, null, 2));
  process.exit(fail ? 1 : 0);
}

main();
