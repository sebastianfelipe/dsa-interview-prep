const STORAGE_KEY = 'dsa-studio-solutions-revealed';

/** Default: solutions are shown. */
export function readSolutionsRevealed(): boolean {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === '0' || value === 'false') return false;
    if (value === '1' || value === 'true') return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function writeSolutionsRevealed(revealed: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, revealed ? '1' : '0');
  } catch {
    /* ignore */
  }
}
