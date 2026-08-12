const THEME_KEY = 'dsa-studio-theme';
const PALETTE_KEY = 'dsa-studio-palette';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

/** Named color systems — cycle from the header control. */
export const PALETTES = ['ink', 'forest', 'slate', 'signal'] as const;
export type PaletteId = (typeof PALETTES)[number];

export const PALETTE_LABELS: Record<PaletteId, string> = {
  ink: 'Ink',
  forest: 'Forest',
  slate: 'Slate',
  signal: 'Signal',
};

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    /* ignore */
  }
  return 'system';
}

export function writeThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function readPalette(): PaletteId {
  try {
    const value = localStorage.getItem(PALETTE_KEY);
    if (value && (PALETTES as readonly string[]).includes(value)) {
      return value as PaletteId;
    }
  } catch {
    /* ignore */
  }
  return 'ink';
}

export function writePalette(palette: PaletteId) {
  try {
    localStorage.setItem(PALETTE_KEY, palette);
  } catch {
    /* ignore */
  }
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function applyTheme(preference: ThemePreference, palette: PaletteId = readPalette()) {
  const resolved = resolveTheme(preference);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.palette = palette;
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}

export function cycleThemePreference(current: ThemePreference): ThemePreference {
  if (current === 'system') return 'dark';
  if (current === 'dark') return 'light';
  return 'system';
}

export function cyclePalette(current: PaletteId): PaletteId {
  const index = PALETTES.indexOf(current);
  return PALETTES[(index + 1) % PALETTES.length];
}

export function themeLabel(preference: ThemePreference): string {
  if (preference === 'system') return 'System';
  if (preference === 'dark') return 'Dark';
  return 'Light';
}

export function paletteLabel(palette: PaletteId): string {
  return PALETTE_LABELS[palette];
}
