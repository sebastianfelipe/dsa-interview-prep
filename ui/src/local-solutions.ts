export type LocalSolutionMode = 'hint' | 'full';

export interface LocalSolution {
  id: string;
  title: string;
  source: 'ai' | 'local';
  /** Present on newer AI chips; older entries are inferred from code. */
  mode?: LocalSolutionMode;
  /** Optional Ask AI guidance the learner typed when this chip was created. */
  guidance?: string;
  /** Last in-place coach markdown for local drafts (not a new chip). */
  coachNotes?: string;
  notes?: string;
  description?: string;
  time?: string;
  space?: string;
  code: string;
  language: string;
  createdAt: string;
}

/** Stable id for the permanent per-problem draft chip. */
export const OWN_CODE_ID = 'your-code';

/** Classify AI/local chips for ordering and labels. */
export function localSolutionKind(s: LocalSolution): 'hint' | 'ai' | 'local' {
  if (s.source === 'local') return 'local';
  if (s.mode === 'hint') return 'hint';
  if (s.mode === 'full') return 'ai';
  return s.code.trim() ? 'ai' : 'hint';
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

function normalizeCode(code: string) {
  return code.replace(/\s+/g, ' ').trim();
}

export function listLocalSolutions(topic: string, slug: string): LocalSolution[] {
  return readStore()[problemKey(topic, slug)] ?? [];
}

export function saveLocalSolution(topic: string, slug: string, solution: LocalSolution) {
  const store = readStore();
  const key = problemKey(topic, slug);
  const existing = store[key] ?? [];
  // Own-code drafts always keep the stable id + title.
  const entry =
    solution.source === 'local'
      ? { ...solution, id: OWN_CODE_ID, title: 'Your code', source: 'local' as const }
      : solution;
  const without = existing.filter((s) => {
    if (entry.source === 'local') return s.source !== 'local' && s.id !== entry.id;
    return s.id !== entry.id;
  });
  store[key] = [entry, ...without];
  writeStore(store);
}

export function removeLocalSolution(topic: string, slug: string, id: string) {
  const store = readStore();
  const key = problemKey(topic, slug);
  const existing = store[key] ?? [];
  // Never delete the permanent "Your code" draft.
  if (id === OWN_CODE_ID || existing.some((s) => s.id === id && s.source === 'local')) return;
  const next = existing.filter((s) => s.id !== id);
  if (next.length === 0) delete store[key];
  else store[key] = next;
  writeStore(store);
}

export function createAiSolutionId() {
  return `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createLocalSolutionId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Ensure a single permanent "Your code" draft exists for the problem.
 * Also repairs drafts that were accidentally overwritten with an AI solution chip.
 */
export function createOwnCodeDraft(
  topic: string,
  slug: string,
  starterCode = '',
): LocalSolution {
  const seed = starterCode.trim() ? starterCode.replace(/\s*$/, '') + '\n' : '';
  const store = readStore();
  const key = problemKey(topic, slug);
  const existing = store[key] ?? [];
  const locals = existing.filter((s) => s.source === 'local');
  const aiCodes = new Set(
    existing
      .filter((s) => s.source === 'ai' && s.code.trim())
      .map((s) => normalizeCode(s.code)),
  );

  let draft = locals[0];
  if (draft) {
    const contaminated = Boolean(draft.code.trim() && aiCodes.has(normalizeCode(draft.code)));
    const empty = !draft.code.trim();
    draft = {
      ...draft,
      id: OWN_CODE_ID,
      title: 'Your code',
      source: 'local',
      language: 'typescript',
      code: contaminated ? seed : empty && seed ? seed : draft.code,
    };
  } else {
    draft = {
      id: OWN_CODE_ID,
      title: 'Your code',
      source: 'local',
      code: seed,
      language: 'typescript',
      createdAt: new Date().toISOString(),
    };
  }

  store[key] = [draft, ...existing.filter((s) => s.source !== 'local')];
  writeStore(store);
  return draft;
}
