/** Remember which Browse topic / Lists prep list the learner was in. */

const LIST_KEY = 'dsa-studio-last-list';
const BROWSE_KEY = 'dsa-studio-last-browse';
const REFERENCE_KEY = 'dsa-studio-last-reference';

export interface LastBrowse {
  topic: string;
  difficulty?: string;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readLastListId(): string | null {
  try {
    return sessionStorage.getItem(LIST_KEY);
  } catch {
    return null;
  }
}

export function writeLastListId(id: string) {
  try {
    sessionStorage.setItem(LIST_KEY, id);
  } catch {
    /* ignore */
  }
}

export function readLastBrowse(): LastBrowse | null {
  const parsed = readJson<LastBrowse>(BROWSE_KEY);
  if (parsed && typeof parsed.topic === 'string' && parsed.topic) return parsed;
  return null;
}

export function writeLastBrowse(topic: string, difficulty?: string) {
  try {
    const value: LastBrowse = { topic };
    if (difficulty) value.difficulty = difficulty;
    sessionStorage.setItem(BROWSE_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function browsePath(topic?: string | null, difficulty?: string | null): string {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  if (difficulty) params.set('difficulty', difficulty);
  const qs = params.toString();
  return qs ? `/browse?${qs}` : '/browse';
}

export function listsPath(listId?: string | null): string {
  return listId ? `/lists?list=${encodeURIComponent(listId)}` : '/lists';
}

export function lastBrowsePath(): string {
  const last = readLastBrowse();
  return last ? browsePath(last.topic, last.difficulty) : '/browse';
}

export function lastListsPath(): string {
  return listsPath(readLastListId());
}

export function readLastReference(): string | null {
  try {
    return sessionStorage.getItem(REFERENCE_KEY);
  } catch {
    return null;
  }
}

export function writeLastReference(path: string) {
  try {
    sessionStorage.setItem(REFERENCE_KEY, path);
  } catch {
    /* ignore */
  }
}

/** From a SQL exercise, point Reference at query notes unless already in the SQL docs. */
export function preferSqlReference() {
  const last = readLastReference();
  if (
    last &&
    (last === 'resources/sql' ||
      last.startsWith('resources/sql/') ||
      last.startsWith('topics/17-sql/'))
  ) {
    return;
  }
  writeLastReference('resources/sql/README');
}

export function lastReferencePath(): string {
  const last = readLastReference();
  return last ? `/reference/${last}` : '/reference';
}
