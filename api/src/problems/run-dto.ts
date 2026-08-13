export type RunMode = 'run' | 'submit';

export interface RunBody {
  code: string;
  language?: string;
  mode?: RunMode;
}

export interface CaseResultDto {
  id: string;
  status: 'passed' | 'failed' | 'error';
  inputs: unknown;
  expected: unknown;
  actual?: unknown;
  error?: string;
}

export interface RunResultDto {
  passed: boolean;
  mode: RunMode;
  summary: { total: number; passed: number; failed: number };
  cases: CaseResultDto[];
  durationMs: number;
  stdout?: string;
  stderr?: string;
}
