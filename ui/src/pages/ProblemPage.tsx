import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  api,
  type AiExplainMode,
  type Catalog,
  type ListDetail,
  type ProblemDetail,
  type SolutionDetail,
  type SolutionEntry,
} from '../api';
import { CodeBlock } from '../components/CodeBlock';
import { Markdown } from '../components/Markdown';
import { ProblemNav } from '../components/ProblemNav';
import {
  createAiSolutionId,
  listLocalSolutions,
  removeLocalSolution,
  saveLocalSolution,
  type LocalSolution,
} from '../local-solutions';
import { useSolutionReveal } from '../solution-reveal-context';
import {
  findProblemNeighbors,
  flattenCatalogProblems,
  flattenListProblems,
} from '../problem-sequence';

function chipLabel(s: SolutionEntry) {
  if (s.source === 'ai') return `AI · ${s.title}`;
  if (s.source === 'yours') return `Yours · ${s.title}`;
  if (s.source === 'local') return `Local · ${s.title}`;
  return s.title;
}

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
  const [localSolutions, setLocalSolutions] = useState<LocalSolution[]>([]);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshLocals = useCallback(() => {
    setLocalSolutions(listLocalSolutions(topic, slug));
  }, [topic, slug]);

  useEffect(() => {
    api
      .aiStatus()
      .then((s) => setAiConfigured(s.configured))
      .catch(() => setAiConfigured(false));
  }, []);

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
    setAiError(null);
    refreshLocals();
    api
      .problem(topic, slug)
      .then((p) => {
        setProblem(p);
        const locals = listLocalSolutions(topic, slug);
        const preferred =
          locals[0]?.id ??
          p.solutions.find((s) => s.id === 'recommended')?.id ??
          p.solutions[0]?.id ??
          'recommended';
        setSelectedId(preferred);
      })
      .catch((e) => setError(String(e)));
  }, [topic, slug, refreshLocals]);

  const solutions = useMemo((): SolutionEntry[] => {
    const repo = problem?.solutions ?? [];
    const localEntries: SolutionEntry[] = localSolutions.map((s) => ({
      id: s.id,
      title: s.title,
      file: '',
      source: s.source,
      notes: s.notes,
      description: s.description,
      time: s.time,
      space: s.space,
    }));
    return [...localEntries, ...repo];
  }, [problem?.solutions, localSolutions]);

  const selectedLocal = useMemo(
    () => localSolutions.find((s) => s.id === selectedId) ?? null,
    [localSolutions, selectedId],
  );

  useEffect(() => {
    if (!problem) {
      setSolution(null);
      return;
    }

    if (selectedLocal) {
      setSolution({
        id: selectedLocal.id,
        title: selectedLocal.title,
        source: selectedLocal.source,
        notes: selectedLocal.notes,
        description: selectedLocal.description,
        time: selectedLocal.time,
        space: selectedLocal.space,
        language: selectedLocal.language || 'typescript',
        code: selectedLocal.code,
        path: 'localStorage',
      });
      return;
    }

    if (!problem.hasSolution) {
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
  }, [problem, topic, slug, selectedId, selectedLocal]);

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

  async function askAi(mode: AiExplainMode) {
    setAiBusy(true);
    setAiError(null);
    try {
      const result = await api.aiExplain(topic, slug, mode);
      const entry: LocalSolution = {
        id: createAiSolutionId(),
        title: result.title,
        source: 'ai',
        notes: result.notes,
        description: result.description,
        time: result.time,
        space: result.space,
        code: result.code ?? '',
        language: result.language || 'typescript',
        createdAt: new Date().toISOString(),
      };
      saveLocalSolution(topic, slug, entry);
      refreshLocals();
      setSelectedId(entry.id);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
    } finally {
      setAiBusy(false);
    }
  }

  function discardSelectedLocal() {
    if (!selectedLocal) return;
    removeLocalSolution(topic, slug, selectedLocal.id);
    const remaining = listLocalSolutions(topic, slug);
    setLocalSolutions(remaining);
    const next =
      remaining[0]?.id ??
      problem?.solutions.find((s) => s.id === 'recommended')?.id ??
      problem?.solutions[0]?.id ??
      'recommended';
    setSelectedId(next);
  }

  if (error) return <main className="page">{error}</main>;
  if (!problem) return <main className="page">Loading…</main>;

  const selected = solutions.find((s) => s.id === selectedId) ?? solutions[0];
  const description = solution?.description ?? selected?.description;
  const notes = solution?.notes ?? selected?.notes;
  const time = solution?.time ?? selected?.time;
  const space = solution?.space ?? selected?.space;
  const showSolutionPane = true;
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
                {chipLabel(s)}
              </button>
            ))}
          </div>
          <div className="solution-compare-meta">
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
            <div
              className={`solution-ai${aiConfigured ? '' : ' is-locked'}`}
              title={
                aiConfigured
                  ? 'Saved only in this browser — not added to the project'
                  : 'Add an OpenAI API key to unlock AI hints and solutions'
              }
            >
              <button
                type="button"
                className="btn btn-ghost solution-ai-btn"
                disabled={!aiConfigured || aiBusy}
                aria-label={
                  aiConfigured
                    ? 'Ask AI for a hint'
                    : 'Ask AI hint (locked — add an OpenAI API key to unlock)'
                }
                onClick={() => askAi('hint')}
              >
                {aiBusy ? '…' : 'Hint'}
              </button>
              <button
                type="button"
                className="btn btn-accent solution-ai-btn"
                disabled={!aiConfigured || aiBusy}
                aria-label={
                  aiConfigured
                    ? 'Ask AI for a full solution'
                    : 'Ask AI solution (locked — add an OpenAI API key to unlock)'
                }
                onClick={() => askAi('full')}
              >
                {aiBusy ? '…' : 'Ask AI'}
              </button>
              {selectedLocal && (
                <button
                  type="button"
                  className="btn btn-ghost solution-ai-btn"
                  disabled={aiBusy}
                  title="Remove this local AI solution"
                  onClick={discardSelectedLocal}
                >
                  Discard
                </button>
              )}
            </div>
          </div>
          {aiError && <p className="solution-ai-error">{aiError}</p>}
        </div>

        {notes && <p className="solution-compare-notes">{notes}</p>}
        {description ? (
          <Markdown source={description} />
        ) : solutions.length === 0 ? (
          <p className="muted">No solutions yet — use Ask AI when unlocked.</p>
        ) : (
          <p className="muted">No comparison notes for this solution yet.</p>
        )}
      </div>

      <div className={`solution-block${revealed ? '' : ' is-locked'}`}>
        <div className="solution-meta">
          <strong>Code</strong>
        </div>
        <div className="solution-code-wrap">
          {solution && solution.code ? (
            <CodeBlock
              code={solution.code}
              language={solution.language || 'typescript'}
              className="solution-code"
              aria-hidden={!revealed}
            />
          ) : (
            <pre className="solution-code">
              <code>
                {selectedLocal && !selectedLocal.code
                  ? 'Hint only — no code for this chip.'
                  : problem.hasSolution
                    ? 'Loading…'
                    : 'No code yet.'}
              </code>
            </pre>
          )}
          {!revealed && solution?.code && (
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
