const THEME_KEY = 'dsa-studio-theme';
const PALETTE_KEY = 'dsa-studio-palette';

export type ThemePreference = 'light' | 'dark';

/** Named color systems — cycle from the header control. */
export const PALETTES = ['studio', 'slate', 'forest', 'signal'] as const;
export type PaletteId = (typeof PALETTES)[number];

export const PALETTE_LABELS: Record<PaletteId, string> = {
  studio: 'Studio',
  slate: 'Slate',
  forest: 'Forest',
  signal: 'Signal',
};

export function getSystemTheme(): ThemePreference {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Prefer the last explicit Light/Dark choice.
 * First visit (or legacy "system") seeds from the OS preference once, then persists it.
 */
export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    /* ignore */
  }

  const initial = getSystemTheme();
  writeThemePreference(initial);
  return initial;
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
    // Migrate previous default "ink" → brand "studio"
    if (value === 'ink') {
      writePalette('studio');
      return 'studio';
    }
    if (value && (PALETTES as readonly string[]).includes(value)) {
      return value as PaletteId;
    }
  } catch {
    /* ignore */
  }
  return 'studio';
}

export function writePalette(palette: PaletteId) {
  try {
    localStorage.setItem(PALETTE_KEY, palette);
  } catch {
    /* ignore */
  }
}

export function applyTheme(preference: ThemePreference, palette: PaletteId = readPalette()) {
  document.documentElement.dataset.theme = preference;
  document.documentElement.dataset.palette = palette;
  document.documentElement.style.colorScheme = preference;
  return preference;
}

export function cycleThemePreference(current: ThemePreference): ThemePreference {
  return current === 'dark' ? 'light' : 'dark';
}

export function cyclePalette(current: PaletteId): PaletteId {
  const index = PALETTES.indexOf(current);
  return PALETTES[(index + 1) % PALETTES.length];
}

export function themeLabel(preference: ThemePreference): string {
  return preference === 'dark' ? 'Dark' : 'Light';
}

export function paletteLabel(palette: PaletteId): string {
  return PALETTE_LABELS[palette];
}
