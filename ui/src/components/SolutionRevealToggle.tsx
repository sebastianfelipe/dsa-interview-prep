import { useSolutionReveal } from '../solution-reveal-context';

export function SolutionRevealToggle() {
  const { revealed, toggle } = useSolutionReveal();
  const label = revealed ? 'Solutions on' : 'Solutions off';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={revealed}
      aria-label={`${label}. Click to ${revealed ? 'hide' : 'show'} solutions.`}
      title={label}
    >
      <span className="solution-reveal-icon" aria-hidden="true" data-on={revealed ? '1' : '0'} />
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
