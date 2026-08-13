const PROBLEM_KEY = 'dsa-studio:workspace:problem-open';
const APPROACH_KEY = 'dsa-studio:workspace:approach-open';

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
