export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemSummary {
  title: string;
  slug: string;
  leetcodeId?: number;
  difficulty: Difficulty;
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

export type CodeLanguage = 'typescript' | 'python';

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

export interface RunResult {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface AiStatus {
  configured: boolean;
  model: string | null;
}

export type AiExplainMode = 'hint' | 'full';

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
  run: async (topic: string, slug: string) => {
    const res = await fetch(`/api/problems/${topic}/${slug}/run`, { method: 'POST' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json() as Promise<RunResult>;
  },
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
  ) => post<AiExplainResult>('/api/ai/explain', { topic, slug, mode, language }),
};
