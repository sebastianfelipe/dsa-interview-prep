import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type ProblemDetail, type RunResult, type SolutionDetail } from '../api';
import { Markdown } from '../components/Markdown';
import { useSolutionReveal } from '../solution-reveal-context';

export function ProblemPage() {
  const { topic = '', slug = '' } = useParams();
  const { revealed } = useSolutionReveal();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [selectedId, setSelectedId] = useState('recommended');
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSolution(null);
    setResult(null);
    setSelectedId('recommended');
    api
      .problem(topic, slug)
      .then((p) => {
        setProblem(p);
        const preferred =
          p.solutions.find((s) => s.id === 'recommended')?.id ?? p.solutions[0]?.id ?? 'recommended';
        setSelectedId(preferred);
      })
      .catch((e) => setError(String(e)));
  }, [topic, slug]);

  useEffect(() => {
    if (!revealed || !problem?.hasSolution) {
      setSolution(null);
      return;
    }

    let cancelled = false;
    api
      .solution(topic, slug, selectedId)
      .then((s) => {
        if (!cancelled) setSolution(s);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [revealed, problem?.hasSolution, topic, slug, selectedId]);

  async function runTests() {
    setRunning(true);
    setResult(null);
    try {
      const r = await api.run(topic, slug);
      setResult(r);
    } catch (e) {
      setResult({
        passed: false,
        exitCode: 1,
        stdout: '',
        stderr: String(e),
        durationMs: 0,
      });
    } finally {
      setRunning(false);
    }
  }

  if (error) return <main className="page">{error}</main>;
  if (!problem) return <main className="page">Loading…</main>;

  const solutions = problem.solutions ?? [];
  const selected = solutions.find((s) => s.id === selectedId) ?? solutions[0];
  const description = solution?.description ?? selected?.description;
  const notes = solution?.notes ?? selected?.notes;
  const showSolution = problem.hasSolution && revealed;

  const problemPane = (
    <div className="panel problem-pane">
      <Markdown source={problem.readme} />

      {problem.hasTests && (
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={runTests} disabled={running}>
            {running ? 'Running…' : 'Run tests'}
          </button>
        </div>
      )}

      {result && (
        <div className={`test-result ${result.passed ? 'pass' : 'fail'}`}>
          {result.passed ? 'All tests passed' : 'Tests failed'} · {result.durationMs}ms
          {'\n\n'}
          {result.stdout || result.stderr}
        </div>
      )}
    </div>
  );

  const solutionPane = (
    <section className="solution-panel">
      {solutions.length > 1 && (
        <div className="filters">
          {solutions.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`chip ${selectedId === s.id ? 'active' : ''}`}
              onClick={() => setSelectedId(s.id)}
            >
              {s.source === 'yours' ? `Yours · ${s.title}` : s.title}
            </button>
          ))}
        </div>
      )}

      <div className="solution-compare">
        <h2 className="solution-compare-title">{selected?.title ?? 'Solution'}</h2>
        {notes && <p className="solution-compare-notes">{notes}</p>}
        {description ? (
          <Markdown source={description} />
        ) : (
          <p className="muted">No comparison notes for this solution yet.</p>
        )}
      </div>

      <div className="solution-block">
        <div className="solution-meta">
          <strong>Code</strong>
          {solution?.path && <span className="muted"> · {solution.path}</span>}
        </div>
        {solution ? (
          <pre>
            <code>{solution.code}</code>
          </pre>
        ) : (
          <pre>
            <code>Loading…</code>
          </pre>
        )}
      </div>
    </section>
  );

  return (
    <main className={`page page-problem${showSolution ? ' page-problem-split' : ''}`}>
      <div className="problem-header">
        <p className="muted">
          <Link to={`/browse?topic=${problem.topic}`}>← {problem.topicTitle}</Link>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
          {problem.leetcodeId != null && <span className="muted">LC {problem.leetcodeId}</span>}
        </div>
      </div>

      {showSolution ? (
        <div className="problem-solution-split">
          {problemPane}
          {solutionPane}
        </div>
      ) : (
        <>
          {problemPane}
          {problem.hasSolution && (
            <p className="muted solution-hidden-hint">
              Solutions are hidden. Turn on <strong>Solutions on</strong> in the header to compare
              approaches.
            </p>
          )}
        </>
      )}
    </main>
  );
}
