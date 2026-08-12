import { useTheme } from '../theme-context';
import { paletteLabel } from '../theme';

export function PaletteToggle() {
  const { palette, cyclePaletteMode } = useTheme();
  const label = paletteLabel(palette);

  return (
    <button
      type="button"
      className="theme-toggle palette-toggle"
      onClick={cyclePaletteMode}
      aria-label={`Palette: ${label}. Click to change.`}
      title={`Palette: ${label}`}
    >
      <span className={`palette-swatch palette-swatch-${palette}`} aria-hidden="true" />
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
