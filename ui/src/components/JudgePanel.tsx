import type { CaseResult, RunMode, RunResult } from '../api';

function formatJson(value: unknown): string {
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function headline(result: RunResult): string {
  if (result.passed) return 'Accepted';
  if (result.cases.some((c) => c.status === 'error')) return 'Runtime Error';
  return 'Wrong Answer';
}

export function JudgePanel({
  result,
  busy,
  mode,
}: {
  result: RunResult | null;
  busy: boolean;
  mode: RunMode | null;
}) {
  if (busy) {
    return (
      <div className="judge-panel" aria-live="polite">
        <p className="judge-headline muted">{mode === 'submit' ? 'Submitting…' : 'Running…'}</p>
      </div>
    );
  }

  if (!result) return null;

  const firstFail = result.cases.find((c) => c.status !== 'passed');
  const runnerError =
    firstFail &&
    (firstFail.id === 'runner' || firstFail.id === 'compile') &&
    firstFail.error
      ? firstFail.error
      : null;

  return (
    <div className={`judge-panel judge-${result.passed ? 'pass' : 'fail'}`} aria-live="polite">
      <div className="judge-summary-row">
        <p className="judge-headline">{headline(result)}</p>
        <p className="judge-metric">
          <strong>
            {result.summary.passed}/{result.summary.total}
          </strong>{' '}
          passed
          <span className="muted"> · {result.mode === 'submit' ? 'Submit' : 'Run'}</span>
          <span className="muted"> · {result.durationMs}ms</span>
        </p>
      </div>
      {runnerError && <p className="judge-error-banner">{runnerError}</p>}

      <ul className="judge-case-list">
        {result.cases.map((c) => (
          <CaseRow key={c.id} caseResult={c} defaultOpen={c.id === firstFail?.id} />
        ))}
      </ul>
    </div>
  );
}

function CaseRow({
  caseResult,
  defaultOpen,
}: {
  caseResult: CaseResult;
  defaultOpen: boolean;
}) {
  const ok = caseResult.status === 'passed';
  return (
    <li className={`judge-case judge-case-${caseResult.status}`}>
      <details open={defaultOpen && !ok}>
        <summary>
          <span className={`judge-case-status ${ok ? 'ok' : 'bad'}`}>
            {ok ? 'Pass' : caseResult.status === 'error' ? 'Error' : 'Fail'}
          </span>
          <span className="judge-case-id">{caseResult.id}</span>
        </summary>
        <div className="judge-case-body">
          <div>
            <div className="judge-io-label">Input</div>
            <pre>{formatJson(caseResult.inputs)}</pre>
          </div>
          <div>
            <div className="judge-io-label">Expected</div>
            <pre>{formatJson(caseResult.expected)}</pre>
          </div>
          <div>
            <div className="judge-io-label">Output</div>
            <pre>{formatJson(caseResult.actual)}</pre>
          </div>
          {caseResult.error && (
            <div>
              <div className="judge-io-label">Error</div>
              <pre className="judge-error">{caseResult.error}</pre>
            </div>
          )}
        </div>
      </details>
    </li>
  );
}
