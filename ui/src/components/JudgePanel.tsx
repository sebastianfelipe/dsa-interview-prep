import { useEffect, useState } from 'react';
import type { CaseResult, RunMode, RunResult } from '../api';

/** Compact single-line JSON so arrays read horizontally, not stacked. */
function formatJson(value: unknown): string {
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value);
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [roomy, setRoomy] = useState(false);

  useEffect(() => {
    if (!result) {
      setDetailsOpen(false);
      setRoomy(false);
      return;
    }
    // On failure, open cases and give them reading room; keep success compact.
    setDetailsOpen(!result.passed);
    setRoomy(!result.passed);
  }, [result]);

  if (busy) {
    return (
      <div className="judge-panel judge-busy" aria-live="polite">
        <p className="judge-headline muted">
          {mode === 'submit' ? 'Submitting…' : 'Running…'}
        </p>
      </div>
    );
  }

  if (!result) return null;

  const firstFail = result.cases.find((c) => c.status !== 'passed') ?? null;
  const runnerError =
    firstFail &&
    (firstFail.id === 'runner' || firstFail.id === 'compile') &&
    firstFail.error
      ? firstFail.error
      : null;

  return (
    <div
      className={[
        'judge-panel',
        `judge-${result.passed ? 'pass' : 'fail'}`,
        detailsOpen ? 'is-expanded' : '',
        roomy && detailsOpen ? 'is-roomy' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
    >
      <div className="judge-summary-row">
        <div className="judge-summary-main">
          <p className="judge-headline">{headline(result)}</p>
          <p className="judge-metric">
            <strong>
              {result.summary.passed}/{result.summary.total}
            </strong>{' '}
            passed
            <span className="muted"> · {result.mode === 'submit' ? 'Submit' : 'Run'}</span>
            <span className="muted"> · {result.durationMs}ms</span>
          </p>
          <div className="judge-case-dots" aria-hidden="true">
            {result.cases.map((c) => (
              <span
                key={c.id}
                className={`judge-dot judge-dot-${c.status === 'passed' ? 'ok' : 'bad'}`}
                title={`${c.id}: ${c.status}`}
              />
            ))}
          </div>
        </div>
        <div className="judge-summary-actions">
          {detailsOpen && (
            <button
              type="button"
              className={`judge-details-toggle${roomy ? ' is-active' : ''}`}
              aria-pressed={roomy}
              onClick={() => setRoomy((v) => !v)}
              title={roomy ? 'Give space back to the code console' : 'Give tests more reading space'}
            >
              {roomy ? 'Shrink tests' : 'Expand tests'}
            </button>
          )}
          <button
            type="button"
            className="judge-details-toggle"
            aria-expanded={detailsOpen}
            onClick={() => {
              setDetailsOpen((open) => {
                const next = !open;
                if (next) setRoomy(true);
                return next;
              });
            }}
          >
            {detailsOpen ? 'Hide cases' : 'Show cases'}
          </button>
        </div>
      </div>

      {runnerError && !detailsOpen && <p className="judge-error-banner">{runnerError}</p>}

      {detailsOpen && (
        <div className="judge-details">
          {runnerError && <p className="judge-error-banner">{runnerError}</p>}
          {firstFail &&
            firstFail.status !== 'passed' &&
            firstFail.id !== 'runner' &&
            firstFail.id !== 'compile' && (
              <div className="judge-focus-case">
                <div className="judge-focus-label">
                  First failure · <span>{firstFail.id}</span>
                </div>
                <div className="judge-case-body judge-case-body-inline">
                  <div>
                    <div className="judge-io-label">Input</div>
                    <pre>{formatJson(firstFail.inputs)}</pre>
                  </div>
                  <div>
                    <div className="judge-io-label">Expected</div>
                    <pre>{formatJson(firstFail.expected)}</pre>
                  </div>
                  <div>
                    <div className="judge-io-label">Output</div>
                    <pre>{formatJson(firstFail.actual)}</pre>
                  </div>
                </div>
                {firstFail.error && <pre className="judge-error">{firstFail.error}</pre>}
              </div>
            )}

          <ul className="judge-case-list">
            {result.cases.map((c) => (
              <CaseRow key={c.id} caseResult={c} defaultOpen={c.id === firstFail?.id && !result.passed} />
            ))}
          </ul>
        </div>
      )}
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
      <details open={defaultOpen}>
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
