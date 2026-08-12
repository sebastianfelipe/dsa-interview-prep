export const CODE_LANGUAGES = ['typescript', 'python'] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

const EXT_TO_LANGUAGE: Record<string, CodeLanguage> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'typescript',
  '.jsx': 'typescript',
  '.py': 'python',
};

const LANGUAGE_TO_EXT: Record<CodeLanguage, string> = {
  typescript: '.ts',
  python: '.py',
};

export const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  typescript: 'TypeScript',
  python: 'Python',
};

export function isCodeLanguage(value: string | null | undefined): value is CodeLanguage {
  return value === 'typescript' || value === 'python';
}

export function languageFromFilename(file: string): CodeLanguage | null {
  const lower = file.toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot < 0) return null;
  return EXT_TO_LANGUAGE[lower.slice(dot)] ?? null;
}

export function extensionForLanguage(language: CodeLanguage): string {
  return LANGUAGE_TO_EXT[language];
}

/** Swap file extension to target language, preserving the rest of the path. */
export function swapLanguageExtension(file: string, language: CodeLanguage): string {
  const dot = file.lastIndexOf('.');
  if (dot < 0) return `${file}${extensionForLanguage(language)}`;
  return `${file.slice(0, dot)}${extensionForLanguage(language)}`;
}

export function normalizeCodeLanguage(
  value: string | null | undefined,
  fallback: CodeLanguage = 'typescript',
): CodeLanguage {
  return isCodeLanguage(value) ? value : fallback;
}
