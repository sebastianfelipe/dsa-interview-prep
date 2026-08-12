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
  writePalette,
  writeThemePreference,
  type PaletteId,
  type ThemePreference,
} from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
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

  const setPreference = useCallback(
    (next: ThemePreference) => {
      writeThemePreference(next);
      setPreferenceState(next);
      applyTheme(next, palette);
    },
    [palette],
  );

  const setPalette = useCallback(
    (next: PaletteId) => {
      writePalette(next);
      setPaletteState(next);
      applyTheme(preference, next);
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
    applyTheme(preference, palette);
  }, [preference, palette]);

  const value = useMemo(
    () => ({
      preference,
      palette,
      setPreference,
      setPalette,
      cycle,
      cyclePaletteMode,
    }),
    [preference, palette, setPreference, setPalette, cycle, cyclePaletteMode],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
