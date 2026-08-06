import { applyTheme, readThemePreference } from './theme';

// Avoid a flash of the wrong theme before React mounts.
applyTheme(readThemePreference());
