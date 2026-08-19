/**
 * SQL judge: runs learner SQL against seeded PGlite (embedded Postgres) databases
 * and compares the result set with the reference solution's output.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PGlite } from '@electric-sql/pglite';
import type { CaseResult, JudgeResult } from './cases';
import type { SqlCase, SqlCaseFile, SqlResultSet } from './sql-cases';

/** JSON/display-friendly scalar: dates → YYYY-MM-DD, numeric strings → numbers. */
function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    // DATE columns come back at midnight; format whichever midnight it is.
    if (value.getUTCHours() === 0 && value.getUTCMinutes() === 0) {
      return value.toISOString().slice(0, 10);
    }
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : Number(value.toFixed(9));
  }
  if (typeof value === 'string') {
    // NUMERIC/DECIMAL arrive as strings; compare them as numbers (3.50 == 3.5).
    if (/^-?\d+$/.test(value)) return Number(value);
    if (/^-?\d*\.\d+$/.test(value)) return Number(Number(value).toFixed(9));
    return value;
  }
  return value;
}

interface RawQueryResult {
  rows: Record<string, unknown>[];
  fields?: { name: string }[];
}

function toResultSet(raw: RawQueryResult): SqlResultSet {
  const columns =
    raw.fields?.map((f) => f.name) ??
    (raw.rows[0] ? Object.keys(raw.rows[0]) : []);
  const rows = raw.rows.map((row) => columns.map((c) => normalizeValue(row[c])));
  return { columns, rows };
}

/** Run a (possibly multi-statement) SQL string, returning the last SELECT-like result. */
async function runQuery(db: PGlite, sql: string): Promise<SqlResultSet> {
  const results = (await db.exec(sql)) as RawQueryResult[];
  for (let i = results.length - 1; i >= 0; i--) {
    const r = results[i];
    if ((r.fields && r.fields.length > 0) || r.rows.length > 0) {
      return toResultSet(r);
    }
  }
  return { columns: [], rows: [] };
}

function sortKey(row: unknown[]): string {
  return JSON.stringify(row);
}

interface CompareOutcome {
  same: boolean;
  reason?: string;
}

/**
 * Column names must match (case-insensitive, any order); rows are compared
 * after reordering learner columns to the reference order. Row order matters
 * only when `ordered` is set on the case file.
 */
function compareResults(
  expected: SqlResultSet,
  actual: SqlResultSet,
  ordered: boolean,
): CompareOutcome {
  const expectedCols = expected.columns.map((c) => c.toLowerCase());
  const actualCols = actual.columns.map((c) => c.toLowerCase());

  if (
    expectedCols.length !== actualCols.length ||
    [...expectedCols].sort().join('\u0000') !== [...actualCols].sort().join('\u0000')
  ) {
    return {
      same: false,
      reason: `Output columns should be [${expected.columns.join(', ')}] but got [${
        actual.columns.join(', ') || 'none'
      }]. Alias your result columns to match.`,
    };
  }

  if (expected.rows.length !== actual.rows.length) {
    return {
      same: false,
      reason: `Expected ${expected.rows.length} row(s) but got ${actual.rows.length}.`,
    };
  }

  // Map learner columns onto the reference column order by name.
  const remap = expectedCols.map((name) => actualCols.indexOf(name));
  const actualRows = actual.rows.map((row) => remap.map((idx) => row[idx]));

  const left = ordered ? expected.rows : [...expected.rows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const right = ordered ? actualRows : [...actualRows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  for (let i = 0; i < left.length; i++) {
    if (sortKey(left[i]) !== sortKey(right[i])) {
      return {
        same: false,
        reason: ordered
          ? `Row ${i + 1} differs (row order matters for this problem).`
          : 'Result rows differ.',
      };
    }
  }
  return { same: true };
}

function seedStatements(seed: string | string[]): string {
  return Array.isArray(seed) ? seed.join('\n') : seed;
}

async function resetDatabase(
  db: PGlite,
  tables: string[],
  schemaSql: string,
  seedSql: string,
): Promise<void> {
  for (const table of tables) {
    await db.exec(`DROP TABLE IF EXISTS ${table} CASCADE;`);
  }
  await db.exec(schemaSql);
  if (seedSql.trim()) await db.exec(seedSql);
}

async function dumpTables(db: PGlite, tables: string[]): Promise<Record<string, SqlResultSet>> {
  const dump: Record<string, SqlResultSet> = {};
  for (const table of tables) {
    dump[table] = await runQuery(db, `SELECT * FROM ${table};`);
  }
  return dump;
}

export async function judgeSqlSolution(
  learnerSql: string,
  file: SqlCaseFile,
  baseDir: string,
  mode: 'run' | 'submit',
): Promise<JudgeResult> {
  const started = Date.now();
  const schemaSql = fs.readFileSync(path.join(baseDir, file.schemaFile), 'utf8');
  const referenceSql = fs.readFileSync(path.join(baseDir, file.solutionFile), 'utf8');
  const ordered = Boolean(file.ordered);
  const cases: SqlCase[] =
    mode === 'submit' ? [...file.examples, ...file.edgeCases] : file.examples;

  const db = new PGlite();
  const results: CaseResult[] = [];

  try {
    for (const c of cases) {
      const seedSql = seedStatements(c.seed);
      let inputs: Record<string, SqlResultSet> | null = null;

      try {
        await resetDatabase(db, file.tables, schemaSql, seedSql);
        inputs = await dumpTables(db, file.tables);
        const expected = await runQuery(db, referenceSql);

        let actual: SqlResultSet;
        try {
          actual = await runQuery(db, learnerSql);
        } catch (err) {
          results.push({
            id: c.id,
            status: 'error',
            inputs,
            expected,
            error: err instanceof Error ? err.message : String(err),
          });
          continue;
        }

        const outcome = compareResults(expected, actual, ordered);
        results.push({
          id: c.id,
          status: outcome.same ? 'passed' : 'failed',
          inputs,
          expected,
          actual,
          ...(outcome.reason ? { error: outcome.reason } : {}),
        });
      } catch (err) {
        results.push({
          id: c.id,
          status: 'error',
          inputs,
          expected: null,
          error: `Case setup failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }
  } finally {
    await db.close();
  }

  const passed = results.filter((r) => r.status === 'passed').length;
  return {
    passed: passed === results.length && results.length > 0,
    mode,
    summary: { total: results.length, passed, failed: results.length - passed },
    cases: results,
    durationMs: Date.now() - started,
  };
}
