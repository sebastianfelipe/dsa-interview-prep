import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type ProblemDetail, type RunResult } from '../api';
import { Markdown } from '../components/Markdown';

export function ProblemPage() {
  const { topic = '', slug = '' } = useParams();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRevealed(false);
    setSolution(null);
    setResult(null);
    api
      .problem(topic, slug)
      .then(setProblem)
      .catch((e) => setError(String(e)));
  }, [topic, slug]);

  async function reveal() {
    if (!revealed && !solution) {
      const s = await api.solution(topic, slug);
      setSolution(s.code);
    }
    setRevealed((v) => !v);
  }

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

  return (
    <main className="page">
      <p className="muted">
        <Link to={`/browse?topic=${problem.topic}`}>← {problem.topicTitle}</Link>
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
        {problem.leetcodeId != null && <span className="muted">LC {problem.leetcodeId}</span>}
      </div>

      <div className="panel">
        <Markdown source={problem.readme} />

        <div className="actions">
          {problem.hasSolution && (
            <button type="button" className="btn btn-accent" onClick={reveal}>
              {revealed ? 'Hide solution' : 'Reveal solution'}
            </button>
          )}
          {problem.hasTests && (
            <button type="button" className="btn btn-primary" onClick={runTests} disabled={running}>
              {running ? 'Running…' : 'Run tests'}
            </button>
          )}
        </div>

        {revealed && solution && (
          <div className="solution-block">
            <pre>
              <code>{solution}</code>
            </pre>
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
    </main>
  );
}
