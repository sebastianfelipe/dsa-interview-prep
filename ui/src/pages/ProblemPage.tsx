import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  api,
  type Catalog,
  type ListDetail,
  type ProblemDetail,
  type RunResult,
  type SolutionDetail,
} from '../api';
import { Markdown } from '../components/Markdown';
import { ProblemNav } from '../components/ProblemNav';
import { useSolutionReveal } from '../solution-reveal-context';
import {
  findProblemNeighbors,
  flattenCatalogProblems,
  flattenListProblems,
} from '../problem-sequence';

export function ProblemPage() {
  const { topic = '', slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const { revealed } = useSolutionReveal();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [list, setList] = useState<ListDetail | null>(null);
  const [selectedId, setSelectedId] = useState('recommended');
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listId) {
      setCatalog(null);
      api
        .list(listId)
        .then(setList)
        .catch(() => setList(null));
      return;
    }

    setList(null);
    api
      .catalog()
      .then(setCatalog)
      .catch(() => setCatalog(null));
  }, [listId]);

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

  const neighbors = useMemo(() => {
    if (listId) {
      if (!list || list.id !== listId) {
        return { index: -1, total: 0, previous: null, next: null };
      }
      return findProblemNeighbors(flattenListProblems(list), topic, slug);
    }

    if (!catalog) return { index: -1, total: 0, previous: null, next: null };
    return findProblemNeighbors(flattenCatalogProblems(catalog), topic, slug);
  }, [listId, list, catalog, topic, slug]);

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
  const time = solution?.time ?? selected?.time;
  const space = solution?.space ?? selected?.space;
  const showSolution = problem.hasSolution && revealed;
  const backTo = list
    ? { to: '/lists', label: list.title }
    : { to: `/browse?topic=${problem.topic}`, label: problem.topicTitle };

  const navProps = {
    previous: neighbors.previous,
    next: neighbors.next,
    index: neighbors.index,
    total: neighbors.total,
    listId,
    label: list?.title ?? null,
  };

  const problemPane = (
    <div className="panel problem-pane">
      <div className="problem-pane-head">
        <div className="problem-pane-title-row">
          <h1 className="problem-pane-title">{problem.title}</h1>
          <ProblemNav {...navProps} />
        </div>
        <div className="problem-pane-meta">
          <Link className="problem-pane-back muted" to={backTo.to}>
            ← {backTo.label}
          </Link>
          <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
          {problem.leetcodeId != null && <span className="muted">LC {problem.leetcodeId}</span>}
        </div>
      </div>

      <div className="problem-readme">
        <Markdown source={problem.readme} />
      </div>

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
        <div className="solution-sticky-head">
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
        </div>
      )}

      <div className="solution-compare">
        <div className="solution-compare-top">
          <h2 className="solution-compare-title">{selected?.title ?? 'Solution'}</h2>
          {(time || space) && (
            <p className="solution-complexity">
              {time && (
                <span>
                  <span className="solution-complexity-label">Time</span> {time}
                </span>
              )}
              {space && (
                <span>
                  <span className="solution-complexity-label">Space</span> {space}
                </span>
              )}
            </p>
          )}
        </div>
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
      {showSolution ? (
        <div className="problem-solution-split">
          <div className="problem-pane-scroll">{problemPane}</div>
          <div className="solution-pane-scroll">{solutionPane}</div>
        </div>
      ) : (
        <>
          {problemPane}
          {problem.hasSolution && (
            <p className="muted solution-hidden-hint">
              Solutions are locked. Unlock them from the header vault control to compare approaches.
            </p>
          )}
        </>
      )}
    </main>
  );
}
