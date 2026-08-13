/** Structured I/O cases for the studio judge (LeetCode-style). */

export type Codec =
  | 'raw'
  | 'list'
  | 'listArray'
  | 'listWithCycle'
  | 'tree'
  | 'treeVal'
  | 'treeList'
  | 'graph';

export type CompareMode =
  | 'deep'
  | 'unordered'
  | 'unorderedNested'
  | 'inplace'
  | 'inplaceLength';

export interface FunctionCaseFile {
  type: 'function';
  exportName: string;
  argNames?: string[];
  /** Per-argument codec; defaults to raw. */
  argCodecs?: Codec[];
  /** How to encode the return value for comparison / display. */
  resultCodec?: Codec;
  compare?: CompareMode;
  /** For inplace / inplaceLength: which argument holds the mutated structure. */
  inplaceArg?: number;
  examples: IoCase[];
  edgeCases: IoCase[];
}

export interface ClassCaseFile {
  type: 'class';
  exportName: string;
  /** Codecs for constructor arguments (e.g. ["tree"] for BSTIterator). */
  ctorCodecs?: Codec[];
  examples: ClassCase[];
  edgeCases: ClassCase[];
}

export type CaseFile = FunctionCaseFile | ClassCaseFile;

export interface IoCase {
  id: string;
  /** Positional arguments (JSON-friendly). */
  inputs: unknown[];
  expected: unknown;
}

export interface ClassCase {
  id: string;
  ops: string[];
  args: unknown[][];
  expected: unknown[];
}

export interface CaseResult {
  id: string;
  status: 'passed' | 'failed' | 'error';
  inputs: unknown;
  expected: unknown;
  actual?: unknown;
  error?: string;
}

export interface JudgeSummary {
  total: number;
  passed: number;
  failed: number;
}

export interface JudgeResult {
  passed: boolean;
  mode: 'run' | 'submit';
  summary: JudgeSummary;
  cases: CaseResult[];
  durationMs: number;
}
