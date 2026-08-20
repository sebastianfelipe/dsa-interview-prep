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
  /** Question typed when coach was last invoked on this draft. */
  coachQuestion?: string;
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

/** Top-level `export function/class/const Name` identifiers. */
function exportedNames(code: string): string[] {
  const names: string[] = [];
  const re =
    /export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(code)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/** Old class-stub bug turned `if (...)` bodies into fake empty methods. */
function hasBrokenControlFlowMethods(code: string): boolean {
  return /(?:^|\n)[ \t]*(?:if|for|while|switch)\s*\([^;]*\)\s*\{\s*\n[ \t]*\n[ \t]*\}/.test(
    code,
  );
}

/** True when code is only empty function/class shells (no real implementation). */
function isEmptyishStub(code: string): boolean {
  const residue = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+/g, '')
    .replace(/\b(?:public|private|protected|readonly|static|async)\b/g, '')
    .replace(/\bconstructor\b|[A-Za-z_$][\w$]*/g, '')
    .replace(/[():=>{}\[\].,|&?<>=+\-*/%!~`;'"\s]/g, '')
    .trim();
  return residue.length === 0;
}

/**
 * True when this draft clearly belongs to a different problem or a bad auto-stub:
 * - identical to another problem's stored chip, or
 * - exports none of the symbols from this problem's starter stub, or
 * - contains the broken `if () { }` method stubs from an earlier generator bug.
 */
function isForeignDraft(
  draftCode: string,
  starterCode: string,
  store: Store,
  currentKey: string,
): boolean {
  const normalized = normalizeCode(draftCode);
  if (!normalized) return false;

  if (hasBrokenControlFlowMethods(draftCode)) return true;

  for (const [key, solutions] of Object.entries(store)) {
    if (key === currentKey) continue;
    for (const s of solutions) {
      if (s.code.trim() && normalizeCode(s.code) === normalized) return true;
    }
  }

  if (!starterCode.trim()) return false;
  const expected = exportedNames(starterCode);
  if (expected.length === 0) return false;
  const actual = exportedNames(draftCode);
  if (actual.length === 0) return false;
  return !expected.some((name) => actual.includes(name));
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
 * Repairs drafts contaminated by AI chips or another problem's code.
 */
export function createOwnCodeDraft(
  topic: string,
  slug: string,
  starterCode = '',
  language = 'typescript',
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
    const contaminatedByAi = Boolean(
      draft.code.trim() && aiCodes.has(normalizeCode(draft.code)),
    );
    // The stub heuristics below are TypeScript-shaped; a plain SQL SELECT would
    // false-positive as "emptyish", so only apply them to TS drafts.
    const contaminatedByOtherProblem =
      language === 'typescript' && isForeignDraft(draft.code, seed, store, key);
    const staleEmptyStub =
      language === 'typescript' &&
      Boolean(seed) &&
      isEmptyishStub(draft.code) &&
      normalizeCode(draft.code) !== normalizeCode(seed);
    const reset =
      contaminatedByAi || contaminatedByOtherProblem || staleEmptyStub;
    const empty = !draft.code.trim();
    draft = {
      ...draft,
      id: OWN_CODE_ID,
      title: 'Your code',
      source: 'local',
      language,
      code: reset ? seed : empty && seed ? seed : draft.code,
      ...(reset ? { coachNotes: undefined, coachQuestion: undefined } : {}),
    };
  } else {
    draft = {
      id: OWN_CODE_ID,
      title: 'Your code',
      source: 'local',
      code: seed,
      language,
      createdAt: new Date().toISOString(),
    };
  }

  store[key] = [draft, ...existing.filter((s) => s.source !== 'local')];
  writeStore(store);
  return draft;
}
