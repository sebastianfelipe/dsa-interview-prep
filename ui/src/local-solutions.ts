export interface LocalSolution {
  id: string;
  title: string;
  source: 'ai' | 'local';
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
  code: string;
  language: string;
  createdAt: string;
}

type Store = Record<string, LocalSolution[]>;

const STORAGE_KEY = 'dsa-studio-local-solutions';

function problemKey(topic: string, slug: string) {
  return `${topic}/${slug}`;
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota / private mode */
  }
}

export function listLocalSolutions(topic: string, slug: string): LocalSolution[] {
  return readStore()[problemKey(topic, slug)] ?? [];
}

export function saveLocalSolution(topic: string, slug: string, solution: LocalSolution) {
  const store = readStore();
  const key = problemKey(topic, slug);
  const existing = store[key] ?? [];
  store[key] = [solution, ...existing.filter((s) => s.id !== solution.id)];
  writeStore(store);
}

export function removeLocalSolution(topic: string, slug: string, id: string) {
  const store = readStore();
  const key = problemKey(topic, slug);
  const next = (store[key] ?? []).filter((s) => s.id !== id);
  if (next.length === 0) delete store[key];
  else store[key] = next;
  writeStore(store);
}

export function createAiSolutionId() {
  return `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
