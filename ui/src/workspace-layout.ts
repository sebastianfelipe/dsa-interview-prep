const PROBLEM_KEY = 'dsa-studio:workspace:problem-open';
const APPROACH_KEY = 'dsa-studio:workspace:approach-open';

/** Tracks the last problem visited in this SPA session for pane continuity. */
let lastVisitedProblemKey: string | null = null;
let problemVisitEpoch = 0;

function readBool(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === '1' || raw === 'true';
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    /* ignore */
  }
}

function problemKey(topic: string, slug: string) {
  return `${topic}/${slug}`;
}

/** At least one of Problem or Approach must stay open. */
export function normalizeWorkspacePanes(problemOpen: boolean, approachOpen: boolean) {
  if (!problemOpen && !approachOpen) {
    return { problemOpen: true, approachOpen: false };
  }
  return { problemOpen, approachOpen };
}

export function readWorkspacePanes() {
  return normalizeWorkspacePanes(readBool(PROBLEM_KEY, true), readBool(APPROACH_KEY, true));
}

/**
 * Fresh entry (browse/lists/home/direct URL): both open.
 * Problem → problem navigation: keep the last saved layout.
 */
export function readWorkspacePanesForProblem(topic: string, slug: string) {
  if (lastVisitedProblemKey == null) {
    return { problemOpen: true, approachOpen: true };
  }
  return readWorkspacePanes();
}

/** Call while a problem page is active; cleanup when leaving the problem flow. */
export function rememberProblemVisit(topic: string, slug: string) {
  const key = problemKey(topic, slug);
  const fromProblem = lastVisitedProblemKey != null;
  lastVisitedProblemKey = key;
  problemVisitEpoch += 1;

  if (!fromProblem) {
    return writeWorkspacePanes(true, true);
  }
  return readWorkspacePanes();
}

export function releaseProblemVisit(topic: string, slug: string) {
  const leaving = problemKey(topic, slug);
  const epochAtRelease = problemVisitEpoch;
  queueMicrotask(() => {
    // Skip clear if another problem visit was remembered (incl. React Strict Mode remount).
    if (problemVisitEpoch !== epochAtRelease) return;
    if (lastVisitedProblemKey === leaving) {
      lastVisitedProblemKey = null;
    }
  });
}

export function readProblemPaneOpen(): boolean {
  return readWorkspacePanes().problemOpen;
}

export function writeProblemPaneOpen(open: boolean) {
  writeBool(PROBLEM_KEY, open);
}

export function readApproachPaneOpen(): boolean {
  return readWorkspacePanes().approachOpen;
}

export function writeApproachPaneOpen(open: boolean) {
  writeBool(APPROACH_KEY, open);
}

export function writeWorkspacePanes(problemOpen: boolean, approachOpen: boolean) {
  const next = normalizeWorkspacePanes(problemOpen, approachOpen);
  writeBool(PROBLEM_KEY, next.problemOpen);
  writeBool(APPROACH_KEY, next.approachOpen);
  return next;
}
