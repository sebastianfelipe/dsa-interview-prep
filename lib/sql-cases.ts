/** Structured SQL cases for the studio judge (LeetCode database-style). */

export interface SqlCase {
  id: string;
  /** SQL statements that seed the tables for this case (schema comes from schemaFile). */
  seed: string | string[];
}

export interface SqlCaseFile {
  type: 'sql';
  /** Only postgres is supported today (PGlite embedded engine). */
  dialect?: 'postgres';
  /** DDL file (relative to the problem dir) creating the tables, no data. */
  schemaFile: string;
  /** Reference query (relative to the problem dir) used to compute expected results. */
  solutionFile: string;
  /** Table names, used to reset state between cases and to show inputs in the UI. */
  tables: string[];
  /** When true, row order must match the reference query output. */
  ordered?: boolean;
  examples: SqlCase[];
  edgeCases: SqlCase[];
}

/** Tabular result set exchanged with the UI. */
export interface SqlResultSet {
  columns: string[];
  rows: unknown[][];
}

export function isSqlCaseFile(file: unknown): file is SqlCaseFile {
  return (
    typeof file === 'object' &&
    file !== null &&
    (file as { type?: string }).type === 'sql'
  );
}
