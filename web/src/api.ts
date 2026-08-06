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

export interface ProblemDetail extends ProblemSummary {
  readme: string;
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

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  catalog: (difficulty?: Difficulty) =>
    get<Catalog>(difficulty ? `/api/catalog?difficulty=${difficulty}` : '/api/catalog'),
  problem: (topic: string, slug: string) => get<ProblemDetail>(`/api/problems/${topic}/${slug}`),
  solution: (topic: string, slug: string) =>
    get<{ language: string; code: string; path: string }>(`/api/problems/${topic}/${slug}/solution`),
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
};
