import { useTheme } from '../theme-context';
import { themeLabel } from '../theme';

export function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const label = themeLabel(preference);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true" />
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
