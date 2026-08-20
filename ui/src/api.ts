export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** dsa = function/class judged in TypeScript; sql = one query judged against Postgres. */
export type ProblemKind = 'dsa' | 'sql';

export interface ProblemSummary {
  title: string;
  slug: string;
  leetcodeId?: number;
  difficulty: Difficulty;
  kind?: ProblemKind;
  tags?: string[];
  topic: string;
  topicTitle: string;
  hasSolution: boolean;
  hasTests: boolean;
  path: string;
}

export interface TopicSummary {
  id: string;
  title: string;
  patterns: { slug: string; title: string }[];
  problems: ProblemSummary[];
}

export interface Catalog {
  topics: TopicSummary[];
  difficulties: Difficulty[];
}

export type CodeLanguage = 'typescript' | 'python' | 'sql';

export interface SolutionEntry {
  id: string;
  title: string;
  file: string;
  languages?: CodeLanguage[];
  implementations?: Partial<Record<CodeLanguage, string>>;
  source: string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
}

export interface ProblemDetail extends ProblemSummary {
  readme: string;
  solutions: SolutionEntry[];
  languages?: CodeLanguage[];
  /** Empty TypeScript function/class stub (or SQL header) for "Your code" drafts. */
  starterCode?: string;
}

export interface SolutionDetail {
  id: string;
  title: string;
  source: string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
  language: string;
  languages?: CodeLanguage[];
  code: string;
  hasCode?: boolean;
  path: string | null;
}

export interface ListSummary {
  id: string;
  title: string;
  difficulty: string;
  url: string;
  total: number;
  covered: number;
}

export interface ListDetail {
  id: string;
  title: string;
  difficulty: string;
  url: string;
  total: number;
  covered: number;
  problems: {
    leetcodeId: number;
    slug: string;
    title: string;
    covered: boolean;
    topic: string | null;
    difficulty: string;
  }[];
}

export type RunMode = 'run' | 'submit';

export interface CaseResult {
  id: string;
  status: 'passed' | 'failed' | 'error';
  inputs: unknown;
  expected: unknown;
  actual?: unknown;
  error?: string;
}

export interface RunResult {
  passed: boolean;
  mode: RunMode;
  summary: { total: number; passed: number; failed: number };
  cases: CaseResult[];
  durationMs: number;
  stdout?: string;
  stderr?: string;
}

export interface AiStatus {
  configured: boolean;
  model: string | null;
}

export type AiExplainMode = 'hint' | 'full' | 'coach';

export interface AiExplainResult {
  title: string;
  notes?: string;
  description: string;
  time?: string;
  space?: string;
  code?: string;
  language: string;
  model: string;
  mode: AiExplainMode;
  guidance?: string;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const err = (await res.json()) as { message?: string | string[] };
      if (typeof err.message === 'string') detail = err.message;
      else if (Array.isArray(err.message)) detail = err.message.join(', ');
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  catalog: (difficulty?: Difficulty) =>
    get<Catalog>(difficulty ? `/api/catalog?difficulty=${difficulty}` : '/api/catalog'),
  problem: (topic: string, slug: string) => get<ProblemDetail>(`/api/problems/${topic}/${slug}`),
  solution: (topic: string, slug: string, id?: string, language?: CodeLanguage) => {
    const params = new URLSearchParams();
    if (id) params.set('id', id);
    if (language) params.set('language', language);
    const qs = params.toString();
    return get<SolutionDetail>(
      `/api/problems/${topic}/${slug}/solution${qs ? `?${qs}` : ''}`,
    );
  },
  run: (
    topic: string,
    slug: string,
    code: string,
    mode: RunMode = 'run',
    language: CodeLanguage = 'typescript',
  ) =>
    post<RunResult>(`/api/problems/${topic}/${slug}/run`, {
      code,
      language,
      mode,
    }),
  submit: (topic: string, slug: string, code: string, language: CodeLanguage = 'typescript') =>
    post<RunResult>(`/api/problems/${topic}/${slug}/submit`, {
      code,
      language,
    }),
  lists: () => get<ListSummary[]>('/api/lists'),
  list: (id: string) => get<ListDetail>(`/api/lists/${id}`),
  docsIndex: () =>
    get<{ sections: { id: string; title: string; docs: { path: string; title: string }[] }[] }>(
      '/api/docs',
    ),
  doc: (path: string) => get<{ path: string; title: string; markdown: string }>(`/api/docs/${path}`),
  aiStatus: () => get<AiStatus>('/api/ai/status'),
  aiExplain: (
    topic: string,
    slug: string,
    mode: AiExplainMode = 'full',
    language: CodeLanguage = 'typescript',
    guidance?: string,
    code?: string,
    judge?: { status: 'passed' | 'failed' | 'unknown'; summary?: string; detail?: string },
  ) =>
    post<AiExplainResult>('/api/ai/explain', {
      topic,
      slug,
      mode,
      language,
      ...(guidance?.trim() ? { guidance: guidance.trim() } : {}),
      ...(typeof code === 'string' ? { code } : {}),
      ...(judge?.status ? { judgeStatus: judge.status } : {}),
      ...(judge?.summary?.trim() ? { judgeSummary: judge.summary.trim() } : {}),
      ...(judge?.detail?.trim() ? { judgeDetail: judge.detail.trim() } : {}),
    }),
};
