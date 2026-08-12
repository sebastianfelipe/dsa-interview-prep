import { applyTheme, readPalette, readThemePreference } from './theme';

// Avoid a flash of the wrong theme before React mounts.
applyTheme(readThemePreference(), readPalette());
