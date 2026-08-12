import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  api,
  type Catalog,
  type ListDetail,
  type ProblemDetail,
  type SolutionDetail,
} from '../api';
import { CodeBlock } from '../components/CodeBlock';
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
    if (!problem?.hasSolution) {
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
  }, [problem?.hasSolution, topic, slug, selectedId]);

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

  if (error) return <main className="page">{error}</main>;
  if (!problem) return <main className="page">Loading…</main>;

  const solutions = problem.solutions ?? [];
  const selected = solutions.find((s) => s.id === selectedId) ?? solutions[0];
  const description = solution?.description ?? selected?.description;
  const notes = solution?.notes ?? selected?.notes;
  const time = solution?.time ?? selected?.time;
  const space = solution?.space ?? selected?.space;
  const showSolutionPane = problem.hasSolution;
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
    <div className="problem-pane">
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

      <div className="panel problem-pane-body">
        <div className="problem-readme">
          <Markdown source={problem.readme} />
        </div>
      </div>
    </div>
  );

  const solutionPane = (
    <section className="solution-panel">
      <div className="solution-compare">
        <div className="solution-compare-switch">
          <div className="solution-compare-chips" role="tablist" aria-label="Solutions">
            {solutions.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selectedId === s.id}
                className={`chip ${selectedId === s.id ? 'active' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                {s.source === 'yours' ? `Yours · ${s.title}` : s.title}
              </button>
            ))}
          </div>
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

      <div className={`solution-block${revealed ? '' : ' is-locked'}`}>
        <div className="solution-meta">
          <strong>Code</strong>
        </div>
        <div className="solution-code-wrap">
          {solution ? (
            <CodeBlock
              code={solution.code}
              language={solution.language || 'typescript'}
              className="solution-code"
              aria-hidden={!revealed}
            />
          ) : (
            <pre className="solution-code">
              <code>Loading…</code>
            </pre>
          )}
          {!revealed && (
            <div className="solution-code-lock">
              <span>Code is locked — unlock from the header to read it</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <main className={`page page-problem${showSolutionPane ? ' page-problem-split' : ''}`}>
      {showSolutionPane ? (
        <div className="problem-solution-split">
          <div className="problem-pane-scroll">{problemPane}</div>
          <div className="solution-pane-scroll">{solutionPane}</div>
        </div>
      ) : (
        problemPane
      )}
    </main>
  );
}
