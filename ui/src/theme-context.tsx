import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyTheme,
  cyclePalette,
  cycleThemePreference,
  readPalette,
  readThemePreference,
  resolveTheme,
  writePalette,
  writeThemePreference,
  type PaletteId,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  palette: PaletteId;
  setPreference: (preference: ThemePreference) => void;
  setPalette: (palette: PaletteId) => void;
  cycle: () => void;
  cyclePaletteMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readThemePreference());
  const [palette, setPaletteState] = useState<PaletteId>(() => readPalette());
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(readThemePreference()),
  );

  const setPreference = useCallback(
    (next: ThemePreference) => {
      writeThemePreference(next);
      setPreferenceState(next);
      setResolved(applyTheme(next, palette));
    },
    [palette],
  );

  const setPalette = useCallback(
    (next: PaletteId) => {
      writePalette(next);
      setPaletteState(next);
      setResolved(applyTheme(preference, next));
    },
    [preference],
  );

  const cycle = useCallback(() => {
    setPreference(cycleThemePreference(preference));
  }, [preference, setPreference]);

  const cyclePaletteMode = useCallback(() => {
    setPalette(cyclePalette(palette));
  }, [palette, setPalette]);

  useEffect(() => {
    setResolved(applyTheme(preference, palette));

    if (preference !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(applyTheme('system', palette));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference, palette]);

  const value = useMemo(
    () => ({
      preference,
      resolved,
      palette,
      setPreference,
      setPalette,
      cycle,
      cyclePaletteMode,
    }),
    [preference, resolved, palette, setPreference, setPalette, cycle, cyclePaletteMode],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
