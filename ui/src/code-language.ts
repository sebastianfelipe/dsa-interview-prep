export const CODE_LANGUAGES = ['typescript', 'python', 'sql'] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

/** Languages offered on regular DSA problems (SQL problems are SQL-only). */
export const DSA_LANGUAGES: CodeLanguage[] = ['typescript', 'python'];

export const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  sql: 'SQL',
};

const STORAGE_KEY = 'dsa-studio-code-language';

export function isCodeLanguage(value: string | null | undefined): value is CodeLanguage {
  return value === 'typescript' || value === 'python' || value === 'sql';
}

export function normalizeCodeLanguage(
  value: string | null | undefined,
  fallback: CodeLanguage = 'typescript',
): CodeLanguage {
  return isCodeLanguage(value) ? value : fallback;
}

export function readCodeLanguage(): CodeLanguage {
  try {
    return normalizeCodeLanguage(localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'typescript';
  }
}

export function writeCodeLanguage(language: CodeLanguage) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    /* ignore */
  }
}
