import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  api,
  type AiExplainMode,
  type Catalog,
  type ListDetail,
  type ProblemDetail,
  type RunMode,
  type RunResult,
  type SolutionDetail,
  type SolutionEntry,
} from '../api';
import { CodeEditor } from '../components/CodeEditor';
import { JudgePanel } from '../components/JudgePanel';
import { Markdown } from '../components/Markdown';
import { ProblemNav } from '../components/ProblemNav';
import {
  CODE_LANGUAGES,
  LANGUAGE_LABELS,
  type CodeLanguage,
  readCodeLanguage,
  writeCodeLanguage,
} from '../code-language';
import { formatSourceCode } from '../format-code';
import { formatComplexity } from '../format-complexity';
import {
  createAiSolutionId,
  listLocalSolutions,
  localSolutionKind,
  removeLocalSolution,
  saveLocalSolution,
  type LocalSolution,
} from '../local-solutions';
import { SolutionRevealToggle } from '../components/SolutionRevealToggle';
import {
  findProblemNeighbors,
  flattenCatalogProblems,
  flattenListProblems,
} from '../problem-sequence';
import { readWorkspacePanes, writeWorkspacePanes } from '../workspace-layout';

function chipLabel(s: SolutionEntry) {
  if (s.source === 'yours') return `Yours · ${s.title}`;
  return s.title;
}

function sortRepoSolutions(repo: SolutionEntry[]): SolutionEntry[] {
  return [...repo].sort((a, b) => {
    if (a.id === 'recommended') return -1;
    if (b.id === 'recommended') return 1;
    if (a.source === 'yours' && b.source !== 'yours') return 1;
    if (b.source === 'yours' && a.source !== 'yours') return -1;
    return 0;
  });
}

type ChipTab = 'repo' | 'ai' | 'hints' | 'local';

const CHIP_TAB_ORDER: ChipTab[] = ['repo', 'ai', 'hints', 'local'];

function chipTabForSource(source: string): ChipTab {
  if (source === 'ai') return 'ai';
  if (source === 'hint') return 'hints';
  if (source === 'local') return 'local';
  return 'repo';
}

export function ProblemPage() {
  const { topic = '', slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [chipTab, setChipTab] = useState<ChipTab>('repo');
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [list, setList] = useState<ListDetail | null>(null);
  const [selectedId, setSelectedId] = useState('recommended');
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [localSolutions, setLocalSolutions] = useState<LocalSolution[]>([]);
  const [language, setLanguage] = useState<CodeLanguage>(() => readCodeLanguage());
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyMode, setAiBusyMode] = useState<AiExplainMode | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGuidance, setAiGuidance] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [codeBuffer, setCodeBuffer] = useState('');
  const [codeSourceKey, setCodeSourceKey] = useState('');
  const [judgeBusy, setJudgeBusy] = useState(false);
  const [judgeMode, setJudgeMode] = useState<RunMode | null>(null);
  const [judgeResult, setJudgeResult] = useState<RunResult | null>(null);
  const [judgeError, setJudgeError] = useState<string | null>(null);
  const [problemOpen, setProblemOpen] = useState(() => readWorkspacePanes().problemOpen);
  const [approachOpen, setApproachOpen] = useState(() => readWorkspacePanes().approachOpen);
  const panesRef = useRef({ problemOpen, approachOpen });
  panesRef.current = { problemOpen, approachOpen };

  const runPaneTransition = useCallback((update: () => void) => {
    const apply = () => {
      flushSync(update);
    };
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(apply);
      return;
    }
    apply();
  }, []);

  const applyWorkspacePanes = useCallback(
    (nextProblem: boolean, nextApproach: boolean) => {
      runPaneTransition(() => {
        const next = writeWorkspacePanes(nextProblem, nextApproach);
        setProblemOpen(next.problemOpen);
        setApproachOpen(next.approachOpen);
      });
    },
    [runPaneTransition],
  );

  // Each control only expands its own section toward a maximum.
  // Collapsing the other section is a side effect of maximizing this one.
  // States: approach-only → both → problem-only (via Problem), and the reverse (via Approach).
  const expandProblemPane = useCallback(() => {
    const { problemOpen: problemIsOpen, approachOpen: approachIsOpen } = panesRef.current;
    if (problemIsOpen && !approachIsOpen) return; // already maximized
    if (!problemIsOpen && approachIsOpen) {
      applyWorkspacePanes(true, true); // approach-only → both
      return;
    }
    applyWorkspacePanes(true, false); // both → problem-only
  }, [applyWorkspacePanes]);

  const expandApproachPane = useCallback(() => {
    const { problemOpen: problemIsOpen, approachOpen: approachIsOpen } = panesRef.current;
    if (approachIsOpen && !problemIsOpen) return; // already maximized
    if (!approachIsOpen && problemIsOpen) {
      applyWorkspacePanes(true, true); // problem-only → both
      return;
    }
    applyWorkspacePanes(false, true); // both → approach-only
  }, [applyWorkspacePanes]);

  const refreshLocals = useCallback(() => {
    setLocalSolutions(listLocalSolutions(topic, slug));
  }, [topic, slug]);

  const setPreferredLanguage = useCallback((next: CodeLanguage) => {
    setLanguage(next);
    writeCodeLanguage(next);
  }, []);

  useEffect(() => {
    setCodeUnlocked(false);
    setChipTab('repo');
  }, [topic, slug]);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-solution-chip="${selectedId}"]`);
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [selectedId, chipTab]);

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
    setJudgeResult(null);
    setJudgeError(null);
    setCodeBuffer('');
    setCodeSourceKey('');
    setAiGuidance('');
    refreshLocals();
    api
      .problem(topic, slug)
      .then((p) => {
        setProblem(p);
        const preferred =
          p.solutions.find((s) => s.id === 'recommended')?.id ??
          p.solutions[0]?.id ??
          'recommended';
        setSelectedId(preferred);
      })
      .catch((e) => setError(String(e)));
  }, [topic, slug, refreshLocals]);

  const solutionGroups = useMemo(() => {
    const repo = sortRepoSolutions(problem?.solutions ?? []);
    const toEntry = (s: LocalSolution, source: SolutionEntry['source']): SolutionEntry => ({
      id: s.id,
      title: s.title,
      file: '',
      languages: [s.language === 'python' ? 'python' : 'typescript'],
      source,
      notes: s.notes,
      description: s.description,
      time: s.time,
      space: s.space,
    });

    const ai: SolutionEntry[] = [];
    const hints: SolutionEntry[] = [];
    const localExtra: SolutionEntry[] = [];
    for (const s of localSolutions) {
      const kind = localSolutionKind(s);
      if (kind === 'hint') hints.push(toEntry(s, 'hint'));
      else if (kind === 'local') localExtra.push(toEntry(s, 'local'));
      else ai.push(toEntry(s, 'ai'));
    }

    return { repo, ai, hints, localExtra };
  }, [problem?.solutions, localSolutions]);

  const solutions = useMemo((): SolutionEntry[] => {
    const { repo, ai, hints, localExtra } = solutionGroups;
    return [...repo, ...ai, ...hints, ...localExtra];
  }, [solutionGroups]);

  const chipTabs = useMemo(() => {
    const labels: Record<ChipTab, string> = {
      repo: 'Approach',
      ai: 'AI',
      hints: 'Hints',
      local: 'Local',
    };
    const items: Record<ChipTab, SolutionEntry[]> = {
      repo: solutionGroups.repo,
      ai: solutionGroups.ai,
      hints: solutionGroups.hints,
      local: solutionGroups.localExtra,
    };
    return CHIP_TAB_ORDER.filter((key) => items[key].length > 0).map((key) => ({
      key,
      label: labels[key],
      items: items[key],
    }));
  }, [solutionGroups]);

  const activeChipTab = chipTabs.some((t) => t.key === chipTab) ? chipTab : (chipTabs[0]?.key ?? 'repo');
  const activeChipItems = chipTabs.find((t) => t.key === activeChipTab)?.items ?? [];

  useEffect(() => {
    const selected = solutions.find((s) => s.id === selectedId);
    if (!selected) return;
    const next = chipTabForSource(selected.source);
    if (chipTabs.some((t) => t.key === next)) setChipTab(next);
  }, [selectedId, solutions, chipTabs]);

  const selectedLocal = useMemo(
    () => localSolutions.find((s) => s.id === selectedId) ?? null,
    [localSolutions, selectedId],
  );

  const selectedRepo = useMemo(
    () => problem?.solutions.find((s) => s.id === selectedId) ?? null,
    [problem?.solutions, selectedId],
  );

  const languageAvailableForSelection = useMemo(() => {
    if (selectedLocal) {
      return (selectedLocal.language || 'typescript') === language;
    }
    if (!selectedRepo) return true;
    const langs = selectedRepo.languages ?? [];
    if (langs.length === 0) return language === 'typescript';
    return langs.includes(language);
  }, [selectedLocal, selectedRepo, language]);

  useEffect(() => {
    if (!problem) {
      setSolution(null);
      return;
    }

    if (selectedLocal) {
      const localLang = selectedLocal.language === 'python' ? 'python' : 'typescript';
      if (localLang !== language) {
        setSolution(null);
        return;
      }
      setSolution({
        id: selectedLocal.id,
        title: selectedLocal.title,
        source: selectedLocal.source,
        notes: selectedLocal.notes,
        description: selectedLocal.description,
        time: selectedLocal.time,
        space: selectedLocal.space,
        language: localLang,
        languages: [localLang],
        code: selectedLocal.code ? formatSourceCode(selectedLocal.code, localLang) : '',
        hasCode: Boolean(selectedLocal.code),
        path: 'localStorage',
      });
      return;
    }

    if (!problem.hasSolution && !selectedRepo) {
      setSolution(null);
      return;
    }

    let cancelled = false;
    api
      .solution(topic, slug, selectedId, language)
      .then((s) => {
        if (!cancelled) setSolution(s);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [problem, topic, slug, selectedId, selectedLocal, selectedRepo, language]);

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
    setAiBusyMode(mode);
    setAiError(null);
    try {
      const result = await api.aiExplain(topic, slug, mode, language, aiGuidance);
      const codeLang = result.language === 'python' ? 'python' : 'typescript';
      const entry: LocalSolution = {
        id: createAiSolutionId(),
        title: result.title,
        source: 'ai',
        mode: result.mode === 'hint' ? 'hint' : 'full',
        notes: result.notes,
        description: result.description,
        time: result.time ? formatComplexity(result.time) : undefined,
        space: result.space ? formatComplexity(result.space) : undefined,
        code: result.code ? formatSourceCode(result.code, codeLang) : '',
        language: codeLang,
        createdAt: new Date().toISOString(),
      };
      saveLocalSolution(topic, slug, entry);
      refreshLocals();
      setSelectedId(entry.id);
      applyWorkspacePanes(panesRef.current.problemOpen, true);
      // Full AI solutions include code — unlock so the new chip is readable immediately.
      if (entry.mode === 'full') setCodeUnlocked(true);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
    } finally {
      setAiBusy(false);
      setAiBusyMode(null);
    }
  }

  function discardLocal(id: string) {
    removeLocalSolution(topic, slug, id);
    const remaining = listLocalSolutions(topic, slug);
    setLocalSolutions(remaining);
    if (selectedId !== id) return;
    const next =
      remaining[0]?.id ??
      problem?.solutions.find((s) => s.id === 'recommended')?.id ??
      problem?.solutions[0]?.id ??
      'recommended';
    setSelectedId(next);
  }

  // Lock applies to repo + AI code chips. "Yours" stays editable; hints have no code.
  const canEditCode =
    language === 'typescript' &&
    Boolean(solution?.hasCode && solution.code) &&
    (codeUnlocked || selectedRepo?.source === 'yours');

  useEffect(() => {
    if (!solution?.hasCode || !solution.code || language !== 'typescript') return;
    if (!canEditCode) return;
    const key = `${topic}/${slug}/${selectedId}/${language}/${solution.path ?? 'local'}`;
    if (key === codeSourceKey) return;
    setCodeBuffer(solution.code);
    setCodeSourceKey(key);
    setJudgeResult(null);
    setJudgeError(null);
  }, [solution, language, canEditCode, topic, slug, selectedId, codeSourceKey]);

  async function runJudge(mode: RunMode) {
    if (language !== 'typescript') {
      setJudgeError('Only TypeScript can be judged right now');
      return;
    }
    if (!codeBuffer.trim()) {
      setJudgeError('Add TypeScript code in the console first');
      return;
    }
    setJudgeBusy(true);
    setJudgeMode(mode);
    setJudgeError(null);
    try {
      const result =
        mode === 'submit'
          ? await api.submit(topic, slug, codeBuffer)
          : await api.run(topic, slug, codeBuffer, 'run');
      setJudgeResult(result);
    } catch (e) {
      setJudgeResult(null);
      setJudgeError(e instanceof Error ? e.message : String(e));
    } finally {
      setJudgeBusy(false);
      setJudgeMode(null);
    }
  }

  function saveBufferToLocalChip() {
    if (!selectedLocal) return;
    const entry: LocalSolution = {
      ...selectedLocal,
      code: codeBuffer,
      language: 'typescript',
    };
    saveLocalSolution(topic, slug, entry);
    refreshLocals();
  }

  if (error) return <main className="page">{error}</main>;
  if (!problem) return <main className="page">Loading…</main>;

  const selected = solutions.find((s) => s.id === selectedId) ?? solutions[0];
  const description = solution?.description ?? selected?.description ?? selectedRepo?.description;
  const notes = solution?.notes ?? selected?.notes ?? selectedRepo?.notes;
  const time = formatComplexity(solution?.time ?? selected?.time ?? selectedRepo?.time);
  const space = formatComplexity(solution?.space ?? selected?.space ?? selectedRepo?.space);
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

  const missingLangLabel = LANGUAGE_LABELS[language];
  const showMissingLanguage =
    !selectedLocal &&
    selectedRepo &&
    !languageAvailableForSelection &&
    Boolean(description || notes);
  const isHintView =
    selected?.source === 'hint' ||
    (selectedLocal != null && localSolutionKind(selectedLocal) === 'hint');
  const problemCollapsed = !problemOpen;

  const workspaceClass = [
    'problem-workspace',
    problemOpen ? 'problem-open' : 'problem-collapsed',
    approachOpen ? 'approach-open' : 'approach-collapsed',
    isHintView ? 'hint-view' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const askAiPanel = (
    <section
      className={`workspace-ai-panel${aiConfigured ? '' : ' is-locked'}`}
      aria-label="Ask AI"
    >
      <p className="workspace-ai-panel-desc muted">
        {aiConfigured
          ? 'Optional guidance · creates a separate AI chip'
          : 'Add an OpenAI API key to unlock'}
      </p>
      <form
        className="solution-ai-bar"
        onSubmit={(e) => {
          e.preventDefault();
          if (!aiConfigured || aiBusy) return;
          void askAi('full');
        }}
      >
        <input
          id="ai-guidance"
          className="solution-ai-bar-input"
          type="text"
          maxLength={2000}
          disabled={!aiConfigured || aiBusy}
          placeholder={
            aiConfigured
              ? 'Optional: two pointers, O(1) space…'
              : 'Add an OpenAI API key to unlock'
          }
          value={aiGuidance}
          onChange={(e) => setAiGuidance(e.target.value)}
          aria-label="Guidance for Ask AI"
        />
        <button
          type="button"
          className="solution-ai-btn solution-ai-btn-hint"
          disabled={!aiConfigured || aiBusy}
          title={
            aiConfigured
              ? 'Ask AI for a hint using this guidance'
              : 'Ask AI hint (locked — add an OpenAI API key to unlock)'
          }
          aria-label={
            aiConfigured
              ? 'Ask AI for a hint using this guidance'
              : 'Ask AI hint (locked — add an OpenAI API key to unlock)'
          }
          onClick={() => askAi('hint')}
        >
          {aiBusyMode === 'hint' ? '…' : 'Hint'}
        </button>
        <button
          type="submit"
          className="solution-ai-btn solution-ai-btn-ask"
          disabled={!aiConfigured || aiBusy}
          title={
            aiConfigured
              ? `Ask AI for a full ${LANGUAGE_LABELS[language]} solution`
              : 'Ask AI solution (locked — add an OpenAI API key to unlock)'
          }
          aria-label={
            aiConfigured
              ? `Ask AI for a full ${LANGUAGE_LABELS[language]} solution`
              : 'Ask AI solution (locked — add an OpenAI API key to unlock)'
          }
        >
          {aiBusyMode === 'full' ? 'Working…' : 'Ask AI'}
        </button>
      </form>
      {aiError && <p className="solution-ai-error">{aiError}</p>}
    </section>
  );

  const approachMaximized = approachOpen && !problemOpen;
  const problemMaximized = problemOpen && !approachOpen;

  const approachPanel = approachOpen ? (
    <div
      className={[
        'solution-compare pane-section pane-section-approach pane-section-open',
        problemCollapsed || isHintView ? 'is-notes-focus' : '',
        problemCollapsed ? 'is-expanded' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!approachMaximized && (
        <button
          type="button"
          className="section-chevron pane-section-toggle"
          aria-expanded={false}
          aria-label="Expand approach"
          title="Expand approach"
          onClick={() => expandApproachPane()}
        >
          ▴
        </button>
      )}
      <div className="solution-compare-top">
        <div className="solution-compare-picker">
          {chipTabs.length > 1 ? (
            <div className="solution-chip-tabs" role="tablist" aria-label="Solution groups">
              {chipTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeChipTab === tab.key}
                  className={`solution-chip-tab${activeChipTab === tab.key ? ' is-active' : ''}`}
                  onClick={() => {
                    setChipTab(tab.key);
                    if (!tab.items.some((s) => s.id === selectedId) && tab.items[0]) {
                      setSelectedId(tab.items[0].id);
                    }
                  }}
                >
                  {tab.label}
                  <span className="solution-chip-tab-count">{tab.items.length}</span>
                </button>
              ))}
            </div>
          ) : (
            <span className="solution-compare-title">Approach</span>
          )}
          <div
            className="solution-chip-rail-scroll"
            role="tablist"
            aria-label={`${chipTabs.find((t) => t.key === activeChipTab)?.label ?? 'Approach'} solutions`}
          >
            {activeChipItems.map((s) => {
              const removable = s.source === 'ai' || s.source === 'hint' || s.source === 'local';
              const label = chipLabel(s);
              const groupLabel = chipTabs.find((t) => t.key === activeChipTab)?.label ?? 'Approach';
              return (
                <div
                  key={s.id}
                  data-solution-chip={s.id}
                  className={`chip-group chip-group-${s.source}${selectedId === s.id ? ' is-active' : ''}`}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedId === s.id}
                    className={`chip ${selectedId === s.id ? 'active' : ''}`}
                    title={label}
                    onClick={() => setSelectedId(s.id)}
                  >
                    {label}
                  </button>
                  {removable && (
                    <button
                      type="button"
                      className="chip-remove"
                      disabled={aiBusy}
                      title={`Remove ${groupLabel} · ${label}`}
                      aria-label={`Remove ${groupLabel} · ${label}`}
                      onClick={() => discardLocal(s.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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
        </div>
      </div>
      <div className="solution-compare-body">
        {notes && <p className="solution-compare-notes">{notes}</p>}
        {description ? (
          <Markdown source={description} />
        ) : solutions.length === 0 ? (
          <p className="muted">No writeup for this solution yet.</p>
        ) : (
          <p className="muted">No comparison notes for this solution yet.</p>
        )}
      </div>
    </div>
  ) : (
    <button
      type="button"
      className="section-collapse-bar pane-section pane-section-approach pane-section-closed"
      aria-expanded={false}
      aria-label="Expand approach"
      title="Expand approach"
      onClick={() => expandApproachPane()}
    >
      <span className="section-collapse-bar-label">Approach</span>
      <span className="section-chevron section-chevron-static" aria-hidden="true">
        ▴
      </span>
    </button>
  );

  return (
    <main className={`page page-problem${showSolutionPane ? ' page-problem-split' : ''}`}>
      <div className={workspaceClass}>
        <aside className="workspace-problem">
          <div className={`problem-pane${problemCollapsed ? ' problem-pane-collapsed' : ''}`}>
            <div className="problem-pane-head">
              <div className="problem-pane-title-row">
                <h1 className="problem-pane-title">{problem.title}</h1>
                <div className="problem-pane-head-actions">
                  <ProblemNav {...navProps} />
                </div>
              </div>
              <div className="problem-pane-meta">
                <Link className="problem-pane-back muted" to={backTo.to}>
                  ← {backTo.label}
                </Link>
                <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
                {problem.leetcodeId != null && <span className="muted">LC {problem.leetcodeId}</span>}
              </div>
            </div>

            {problemOpen ? (
              <div className="panel problem-pane-body pane-section pane-section-problem pane-section-open">
                {!problemMaximized && (
                  <button
                    type="button"
                    className="section-chevron pane-section-toggle"
                    aria-expanded={false}
                    aria-label="Expand problem description"
                    title="Expand problem description"
                    onClick={() => expandProblemPane()}
                  >
                    ▾
                  </button>
                )}
                <div className="problem-readme">
                  <Markdown source={problem.readme} />
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="section-collapse-bar pane-section pane-section-problem pane-section-closed"
                aria-expanded={false}
                aria-label="Expand problem description"
                title="Expand problem description"
                onClick={() => expandProblemPane()}
              >
                <span className="section-collapse-bar-label">Problem</span>
                <span className="section-chevron section-chevron-static" aria-hidden="true">
                  ▾
                </span>
              </button>
            )}

            {approachPanel}
          </div>
        </aside>

        <section className="workspace-main solution-panel">
          <div
            className={[
              'solution-block',
              canEditCode || !solution?.code ? '' : 'is-locked',
              isHintView ? 'is-hint-only' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="solution-meta">
              <strong>Code</strong>
              <div className="solution-meta-actions">
                <div className="language-switch" role="tablist" aria-label="Code language">
                  {CODE_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      role="tab"
                      aria-selected={language === lang}
                      className={`language-chip ${language === lang ? 'active' : ''}`}
                      onClick={() => setPreferredLanguage(lang)}
                    >
                      {LANGUAGE_LABELS[lang]}
                    </button>
                  ))}
                </div>
                <div className="judge-actions">
                  {selectedLocal && language === 'typescript' && canEditCode && (
                    <button
                      type="button"
                      className="judge-btn judge-btn-ghost"
                      disabled={judgeBusy || !codeBuffer.trim()}
                      onClick={saveBufferToLocalChip}
                    >
                      Save
                    </button>
                  )}
                  <button
                    type="button"
                    className="judge-btn"
                    disabled={
                      judgeBusy ||
                      !canEditCode ||
                      language !== 'typescript' ||
                      !codeBuffer.trim() ||
                      !problem.hasTests
                    }
                    title={
                      language !== 'typescript'
                        ? 'Judging is TypeScript-only for now'
                        : !problem.hasTests
                          ? 'No I/O cases for this problem'
                          : 'Run against example cases'
                    }
                    onClick={() => runJudge('run')}
                  >
                    {judgeBusy && judgeMode === 'run' ? 'Running…' : 'Run'}
                  </button>
                  <button
                    type="button"
                    className="judge-btn judge-btn-submit"
                    disabled={
                      judgeBusy ||
                      !canEditCode ||
                      language !== 'typescript' ||
                      !codeBuffer.trim() ||
                      !problem.hasTests
                    }
                    title={
                      language !== 'typescript'
                        ? 'Judging is TypeScript-only for now'
                        : !problem.hasTests
                          ? 'No I/O cases for this problem'
                          : 'Submit against examples + edge cases'
                    }
                    onClick={() => runJudge('submit')}
                  >
                    {judgeBusy && judgeMode === 'submit' ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
                <SolutionRevealToggle
                  revealed={codeUnlocked}
                  onToggle={() => setCodeUnlocked((open) => !open)}
                />
              </div>
            </div>
            <div className="solution-code-wrap">
              {canEditCode ? (
                <CodeEditor
                  className="solution-code"
                  language={language}
                  value={codeBuffer}
                  onChange={(next) => {
                    setCodeBuffer(next);
                    setJudgeResult(null);
                  }}
                  aria-label="Solution code console"
                />
              ) : selectedLocal && languageAvailableForSelection && !selectedLocal.code ? (
                <pre className="solution-code">
                  <code>Hint only — no code for this chip.</code>
                </pre>
              ) : showMissingLanguage || (selectedLocal && !languageAvailableForSelection) ? (
                <pre className="solution-code">
                  <code>
                    {selectedLocal
                      ? `This AI chip is ${LANGUAGE_LABELS[selectedLocal.language === 'python' ? 'python' : 'typescript']} — switch language or Ask AI for ${missingLangLabel}.`
                      : `No ${missingLangLabel} yet for this approach — Ask AI to generate one, or add solution${language === 'python' ? '.py' : '.ts'}.`}
                  </code>
                </pre>
              ) : language === 'typescript' &&
                languageAvailableForSelection &&
                Boolean(solution?.code) &&
                !codeUnlocked ? (
                <pre className="solution-code solution-code-locked-placeholder" aria-hidden="true">
                  <code>{solution?.code}</code>
                </pre>
              ) : languageAvailableForSelection &&
                (problem.hasSolution || Boolean(selectedLocal)) &&
                language === 'typescript' ? (
                <pre className="solution-code">
                  <code>Loading…</code>
                </pre>
              ) : (
                <pre className="solution-code">
                  <code>No code yet.</code>
                </pre>
              )}
              {!codeUnlocked && Boolean(solution?.code) && !canEditCode && (
                <div className="solution-code-lock">
                  <span>Code is locked — unlock to read it</span>
                </div>
              )}
            </div>
            {(judgeError || judgeResult || judgeBusy) && (
              <div className="judge-footer">
                {judgeError && !judgeBusy && (
                  <p className="judge-error-banner judge-error-banner-footer">{judgeError}</p>
                )}
                <JudgePanel result={judgeResult} busy={judgeBusy} mode={judgeMode} />
              </div>
            )}
          </div>

          {askAiPanel}
        </section>
      </div>
    </main>
  );
}
