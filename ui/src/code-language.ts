export const CODE_LANGUAGES = ['typescript', 'python'] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  typescript: 'TypeScript',
  python: 'Python',
};

const STORAGE_KEY = 'dsa-studio-code-language';

export function isCodeLanguage(value: string | null | undefined): value is CodeLanguage {
  return value === 'typescript' || value === 'python';
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
