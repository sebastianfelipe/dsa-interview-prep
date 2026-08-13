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

export function readProblemPaneOpen(): boolean {
  return readBool(PROBLEM_KEY, true);
}

export function writeProblemPaneOpen(open: boolean) {
  writeBool(PROBLEM_KEY, open);
}

export function readApproachPaneOpen(): boolean {
  return readBool(APPROACH_KEY, true);
}

export function writeApproachPaneOpen(open: boolean) {
  writeBool(APPROACH_KEY, open);
}
