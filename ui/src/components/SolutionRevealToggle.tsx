function VaultIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="vault-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 10V8a5 5 0 0 1 9.9-1h-2.1A3 3 0 0 0 9 8v2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zm5 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5z"
        />
      </svg>
    );
  }

  return (
    <svg className="vault-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zm2 0h6V8a3 3 0 0 0-6 0zm3 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5z"
      />
    </svg>
  );
}

type SolutionRevealToggleProps = {
  revealed: boolean;
  onToggle: () => void;
};

export function SolutionRevealToggle({ revealed, onToggle }: SolutionRevealToggleProps) {
  const label = revealed ? 'Unlocked' : 'Locked';

  return (
    <button
      type="button"
      className="theme-toggle vault-toggle code-lock-toggle"
      onClick={onToggle}
      aria-pressed={revealed}
      aria-label={`Solutions ${label.toLowerCase()}. Click to ${revealed ? 'lock' : 'unlock'} solutions.`}
      title={`Solutions ${label.toLowerCase()}`}
    >
      <VaultIcon open={revealed} />
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
