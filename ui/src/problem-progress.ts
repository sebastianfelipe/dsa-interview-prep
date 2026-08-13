export type ProblemProgressStatus = 'passed' | 'attempted';

export interface ProblemProgress {
  status: ProblemProgressStatus;
  updatedAt: string;
}

type Store = Record<string, ProblemProgress>;

const STORAGE_KEY = 'dsa-studio-problem-progress';
const CHANGE_EVENT = 'dsa-studio-problem-progress';

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
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getProblemProgress(topic: string, slug: string): ProblemProgress | null {
  return readStore()[problemKey(topic, slug)] ?? null;
}

export function listProblemProgress(): Store {
  return readStore();
}

/**
 * Record a judge attempt.
 * - Successful submit → passed (sticky)
 * - Any other run/submit → attempted (does not downgrade passed)
 */
export function recordProblemAttempt(
  topic: string,
  slug: string,
  outcome: { mode: 'run' | 'submit'; passed: boolean },
) {
  const key = problemKey(topic, slug);
  const store = readStore();
  const current = store[key];
  if (current?.status === 'passed') return current;

  const nextStatus: ProblemProgressStatus =
    outcome.mode === 'submit' && outcome.passed ? 'passed' : 'attempted';

  if (current?.status === nextStatus) return current;

  const next: ProblemProgress = {
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
  store[key] = next;
  writeStore(store);
  return next;
}

export function subscribeProblemProgress(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}
