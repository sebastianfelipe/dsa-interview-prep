import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { CodeBlock } from '../components/CodeBlock';
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
  OWN_CODE_ID,
  createAiSolutionId,
  createOwnCodeDraft,
  listLocalSolutions,
  localSolutionKind,
  removeLocalSolution,
  saveLocalSolution,
  type LocalSolution,
} from '../local-solutions';
import {
  getProblemProgress,
  recordProblemAttempt,
  subscribeProblemProgress,
  type ProblemProgressStatus,
} from '../problem-progress';
import {
  findProblemNeighbors,
  flattenCatalogProblems,
  flattenListProblems,
} from '../problem-sequence';
import {
  readWorkspacePanesForProblem,
  releaseProblemVisit,
  rememberProblemVisit,
  writeWorkspacePanes,
} from '../workspace-layout';

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

type ChipTab = 'repo' | 'ai' | 'hints';

const CHIP_TAB_ORDER: ChipTab[] = ['repo', 'ai', 'hints'];

function chipTabForSource(source: string): ChipTab {
  if (source === 'ai') return 'ai';
  if (source === 'hint') return 'hints';
  // Your code stays on Approach so it is always one click away.
  return 'repo';
}

export function ProblemPage() {
  const { topic = '', slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const [chipTab, setChipTab] = useState<ChipTab>('repo');
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [list, setList] = useState<ListDetail | null>(null);
  const [selectedId, setSelectedId] = useState(OWN_CODE_ID);
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [localSolutions, setLocalSolutions] = useState<LocalSolution[]>([]);
  const [language, setLanguage] = useState<CodeLanguage>(() => readCodeLanguage());
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyMode, setAiBusyMode] = useState<AiExplainMode | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGuidance, setAiGuidance] = useState('');
  const aiGuidanceRef = useRef(aiGuidance);
  aiGuidanceRef.current = aiGuidance;
  const [coachNotes, setCoachNotes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codeBuffer, setCodeBuffer] = useState('');
  const codeBufferRef = useRef(codeBuffer);
  codeBufferRef.current = codeBuffer;
  const [codeSourceKey, setCodeSourceKey] = useState('');
  const codeSourceKeyRef = useRef(codeSourceKey);
  codeSourceKeyRef.current = codeSourceKey;
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const [judgeBusy, setJudgeBusy] = useState(false);
  const [judgeMode, setJudgeMode] = useState<RunMode | null>(null);
  const [judgeResult, setJudgeResult] = useState<RunResult | null>(null);
  const [progressStatus, setProgressStatus] = useState<ProblemProgressStatus | null>(null);
  const [judgeError, setJudgeError] = useState<string | null>(null);
  const [problemOpen, setProblemOpen] = useState(
    () => readWorkspacePanesForProblem(topic, slug).problemOpen,
  );
  const [approachOpen, setApproachOpen] = useState(
    () => readWorkspacePanesForProblem(topic, slug).approachOpen,
  );
  const panesRef = useRef({ problemOpen, approachOpen });
  panesRef.current = { problemOpen, approachOpen };

  useEffect(() => {
    const next = rememberProblemVisit(topic, slug);
    setProblemOpen(next.problemOpen);
    setApproachOpen(next.approachOpen);
    return () => releaseProblemVisit(topic, slug);
  }, [topic, slug]);

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
    setChipTab('repo');
  }, [topic, slug]);

  useEffect(() => {
    const sync = () => setProgressStatus(getProblemProgress(topic, slug)?.status ?? null);
    sync();
    return subscribeProblemProgress(sync);
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
        // Default workspace: Your code first. Dig into solutions via Approach chips.
        const draft = createOwnCodeDraft(topic, slug, p.starterCode ?? '');
        refreshLocals();
        setSelectedId(OWN_CODE_ID);
        setChipTab('repo');
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
    };
    // Your code always leads Approach — never tucked behind a separate Local tab.
    const items: Record<ChipTab, SolutionEntry[]> = {
      repo: [...solutionGroups.localExtra, ...solutionGroups.repo],
      ai: solutionGroups.ai,
      hints: solutionGroups.hints,
    };
    return CHIP_TAB_ORDER.filter((key) => key === 'repo' || items[key].length > 0).map((key) => ({
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
      const isOwn = selectedLocal.source === 'local';
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
        // Local drafts stay editable even when empty.
        hasCode: isOwn || Boolean(selectedLocal.code),
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
    if (mode === 'coach') {
      await askCoach();
      return;
    }
    const guidance = aiGuidanceRef.current.trim();
    setAiBusy(true);
    setAiBusyMode(mode);
    setAiError(null);
    setAiGuidance('');
    try {
      const result = await api.aiExplain(topic, slug, mode, language, guidance || undefined);
      const codeLang = result.language === 'python' ? 'python' : 'typescript';
      const entry: LocalSolution = {
        id: createAiSolutionId(),
        title: result.title,
        source: 'ai',
        mode: result.mode === 'hint' ? 'hint' : 'full',
        guidance: guidance || undefined,
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
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
      // Restore what they typed if the request fails.
      if (guidance) setAiGuidance(guidance);
    } finally {
      setAiBusy(false);
      setAiBusyMode(null);
    }
  }

  async function askCoach() {
    const draft = selectedLocal?.source === 'local' ? selectedLocal : null;
    if (!draft) {
      setAiError('Open Your code first to get coaching on your draft.');
      return;
    }
    const guidance = aiGuidanceRef.current.trim();
    const code = codeBufferRef.current;
    setAiBusy(true);
    setAiBusyMode('coach');
    setAiError(null);
    setAiGuidance('');
    try {
      const result = await api.aiExplain(
        topic,
        slug,
        'coach',
        'typescript',
        guidance || undefined,
        code,
      );
      const nextNotes = result.description.trim();
      setCoachNotes(nextNotes);
      saveLocalSolution(topic, slug, {
        ...draft,
        id: OWN_CODE_ID,
        title: 'Your code',
        source: 'local',
        code,
        language: 'typescript',
        coachNotes: nextNotes,
        notes: result.notes ?? draft.notes,
      });
      refreshLocals();
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
      if (guidance) setAiGuidance(guidance);
    } finally {
      setAiBusy(false);
      setAiBusyMode(null);
    }
  }

  function discardLocal(id: string) {
    const target = localSolutions.find((s) => s.id === id);
    // Your code is permanent in Approach — only AI/hint chips can be removed.
    if (!target || target.source === 'local') return;
    removeLocalSolution(topic, slug, id);
    const remaining = listLocalSolutions(topic, slug);
    setLocalSolutions(remaining);
    if (selectedId !== id) return;
    const draft = createOwnCodeDraft(topic, slug, problem?.starterCode ?? '');
    setLocalSolutions(listLocalSolutions(topic, slug));
    setSelectedId(draft.id);
    setChipTab('repo');
  }

  const isOwnCode = selectedLocal?.source === 'local';

  // Your code + AI chips are editable. Curated Approach solutions are read-only when selected.
  const canEditCode =
    language === 'typescript' &&
    (isOwnCode ||
      (selectedLocal != null && Boolean(selectedLocal.code)) ||
      selectedRepo?.source === 'yours');

  // Run/Submit uses the editor buffer when editable; otherwise the loaded approach code.
  const runnableCode = (
    canEditCode ? codeBuffer : solution?.code ?? ''
  ).trim();
  const canJudge =
    language === 'typescript' && Boolean(runnableCode) && Boolean(problem?.hasTests);

  const editableSessionRef = useRef<{ chipId: string; key: string } | null>(null);

  const flushEditableLocal = useCallback(
    (chipId: string, code: string) => {
      const current = listLocalSolutions(topic, slug).find(
        (s) => s.id === chipId || (chipId === OWN_CODE_ID && s.source === 'local'),
      );
      if (!current || current.code === code) return;
      if (chipId === OWN_CODE_ID && current.source !== 'local') return;
      saveLocalSolution(topic, slug, {
        ...current,
        id: current.source === 'local' ? OWN_CODE_ID : current.id,
        code,
        language: 'typescript',
      });
    },
    [topic, slug],
  );

  // Seed the editor before paint so autosave never sees a mismatched chip/buffer pair.
  useLayoutEffect(() => {
    if (language !== 'typescript') return;

    let next: { chipId: string; key: string; code: string; coachNotes: string | null } | null =
      null;
    if (isOwnCode && selectedLocal) {
      next = {
        chipId: OWN_CODE_ID,
        key: `${topic}/${slug}/${OWN_CODE_ID}/${language}/local-draft`,
        code: selectedLocal.code || '',
        coachNotes: selectedLocal.coachNotes ?? null,
      };
    } else if (selectedLocal && selectedLocal.code && canEditCode) {
      next = {
        chipId: selectedLocal.id,
        key: `${topic}/${slug}/${selectedId}/${language}/local`,
        code: selectedLocal.code,
        coachNotes: null,
      };
    } else if (selectedRepo?.source === 'yours' && solution?.code && canEditCode) {
      next = {
        chipId: selectedId,
        key: `${topic}/${slug}/${selectedId}/${language}/${solution.path ?? 'yours'}`,
        code: solution.code,
        coachNotes: null,
      };
    }

    const prev = editableSessionRef.current;
    // Flush the previous editable chip before overwriting the buffer.
    if (prev && (!next || prev.key !== next.key) && codeSourceKeyRef.current === prev.key) {
      flushEditableLocal(prev.chipId, codeBufferRef.current);
    }

    if (!next) {
      editableSessionRef.current = null;
      if (codeSourceKeyRef.current) setCodeSourceKey('');
      return;
    }

    editableSessionRef.current = { chipId: next.chipId, key: next.key };
    if (codeSourceKeyRef.current === next.key) return;

    setCodeBuffer(next.code);
    setCodeSourceKey(next.key);
    setCoachNotes(next.coachNotes);
    setJudgeResult(null);
    setJudgeError(null);
  }, [
    solution,
    language,
    canEditCode,
    isOwnCode,
    selectedLocal,
    selectedRepo,
    topic,
    slug,
    selectedId,
    flushEditableLocal,
  ]);

  useEffect(() => {
    if (!isOwnCode) setCoachNotes(null);
    else setCoachNotes(selectedLocal?.coachNotes ?? null);
  }, [isOwnCode, selectedLocal?.id, selectedLocal?.coachNotes]);

  function openOwnCodeDraft() {
    const entry = createOwnCodeDraft(topic, slug, problem?.starterCode ?? '');
    refreshLocals();
    setSelectedId(OWN_CODE_ID);
    setChipTab('repo');
    setPreferredLanguage('typescript');
    // Force the editor to pick up the stored draft (or repaired stub).
    setCodeBuffer(entry.code);
    setCodeSourceKey(`${topic}/${slug}/${OWN_CODE_ID}/typescript/local-draft`);
    editableSessionRef.current = {
      chipId: OWN_CODE_ID,
      key: `${topic}/${slug}/${OWN_CODE_ID}/typescript/local-draft`,
    };
    applyWorkspacePanes(panesRef.current.problemOpen, true);
  }

  async function runJudge(mode: RunMode) {
    if (language !== 'typescript') {
      setJudgeError('Only TypeScript can be judged right now');
      return;
    }
    const code = (canEditCode ? codeBuffer : solution?.code ?? '').trim();
    if (!code) {
      setJudgeError(
        canEditCode
          ? 'Add TypeScript code in the console first'
          : 'No TypeScript code available for this approach',
      );
      return;
    }
    setJudgeBusy(true);
    setJudgeMode(mode);
    setJudgeError(null);
    try {
      const result =
        mode === 'submit'
          ? await api.submit(topic, slug, code)
          : await api.run(topic, slug, code, 'run');
      setJudgeResult(result);
      // Progress tracks your own work only — not curated/read-only approaches.
      if (canEditCode) {
        const progress = recordProblemAttempt(topic, slug, {
          mode,
          passed: result.passed,
        });
        setProgressStatus(progress.status);
      }
    } catch (e) {
      setJudgeResult(null);
      setJudgeError(e instanceof Error ? e.message : String(e));
      if (canEditCode) {
        const progress = recordProblemAttempt(topic, slug, { mode, passed: false });
        setProgressStatus(progress.status);
      }
    } finally {
      setJudgeBusy(false);
      setJudgeMode(null);
    }
  }

  // Autosave editable local chips (Your code / AI drafts) while typing.
  useEffect(() => {
    if (!selectedLocal || !canEditCode || language !== 'typescript') return;
    if (selectedLocal.code === codeBuffer) return;
    const chipId = selectedLocal.source === 'local' ? OWN_CODE_ID : selectedLocal.id;
    const expectedKey =
      selectedLocal.source === 'local'
        ? `${topic}/${slug}/${OWN_CODE_ID}/${language}/local-draft`
        : `${topic}/${slug}/${chipId}/${language}/local`;
    // Buffer still belongs to another chip — wait for layout seeding.
    if (codeSourceKeyRef.current !== expectedKey) return;

    const timer = window.setTimeout(() => {
      if (codeSourceKeyRef.current !== expectedKey) return;
      if (selectedIdRef.current !== chipId) return;
      flushEditableLocal(chipId, codeBufferRef.current);
      refreshLocals();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    codeBuffer,
    selectedLocal,
    canEditCode,
    language,
    topic,
    slug,
    refreshLocals,
    flushEditableLocal,
  ]);

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
      aria-label={isOwnCode ? 'Help with my code' : 'Ask AI'}
    >
      <p className="workspace-ai-panel-desc muted">
        {!aiConfigured
          ? 'Add an OpenAI API key to unlock'
          : isOwnCode
            ? 'Ask about your code — coaching only, won’t replace it'
            : 'Optional guidance · creates a separate AI chip'}
      </p>
      <form
        className="solution-ai-bar"
        onSubmit={(e) => {
          e.preventDefault();
          if (!aiConfigured || aiBusy) return;
          void askAi(isOwnCode ? 'coach' : 'full');
        }}
      >
        <input
          id="ai-guidance"
          className="solution-ai-bar-input"
          type="text"
          maxLength={2000}
          disabled={!aiConfigured || aiBusy}
          placeholder={
            !aiConfigured
              ? 'Add an OpenAI API key to unlock'
              : isOwnCode
                ? 'Optional: what’s stuck? failing case, complexity…'
                : 'Optional: two pointers, O(1) space…'
          }
          value={aiGuidance}
          onChange={(e) => setAiGuidance(e.target.value)}
          aria-label={isOwnCode ? 'Question about your code' : 'Guidance for Ask AI'}
        />
        {isOwnCode ? (
          <button
            type="submit"
            className="solution-ai-btn solution-ai-btn-ask"
            disabled={!aiConfigured || aiBusy}
            title={
              aiConfigured
                ? 'Get coaching on your current code'
                : 'Help with my code (locked — add an OpenAI API key to unlock)'
            }
            aria-label={
              aiConfigured
                ? 'Get coaching on your current code'
                : 'Help with my code (locked — add an OpenAI API key to unlock)'
            }
          >
            {aiBusyMode === 'coach' ? 'Helping…' : 'Help with my code'}
          </button>
        ) : (
          <>
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
          </>
        )}
      </form>
      {aiError && <p className="solution-ai-error">{aiError}</p>}
      {isOwnCode && coachNotes && (
        <div className="solution-ai-coach" aria-live="polite">
          <p className="solution-ai-coach-label">Coach</p>
          <Markdown source={coachNotes} />
        </div>
      )}
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
            {activeChipTab === 'repo' && activeChipItems.length === 0 && (
              <button
                type="button"
                className="chip chip-own-code"
                onClick={() => openOwnCodeDraft()}
              >
                Your code
              </button>
            )}
            {activeChipItems.map((s) => {
              const removable = s.source === 'ai' || s.source === 'hint';
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
        {selectedLocal?.guidance && (
          <p className="solution-compare-guidance">
            <span className="solution-compare-guidance-label">Asked</span> {selectedLocal.guidance}
          </p>
        )}
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
                {progressStatus && (
                  <span
                    className={`status-dot ${progressStatus === 'passed' ? 'ok' : 'attempted'}`}
                    title={
                      progressStatus === 'passed'
                        ? 'Submitted successfully'
                        : 'Attempted — submit a passing solution to mark as passed'
                    }
                  >
                    {progressStatus === 'passed' ? 'Passed' : 'Attempted'}
                  </span>
                )}
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
              isHintView ? 'is-hint-only' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="solution-meta">
              <strong>Code</strong>
              <div className="solution-meta-actions">
                <button
                  type="button"
                  className={`judge-btn judge-btn-ghost${isOwnCode ? ' is-active-own' : ''}`}
                  onClick={() => openOwnCodeDraft()}
                  title="Write your own TypeScript solution"
                >
                  Your code
                </button>
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
                  <button
                    type="button"
                    className="judge-btn"
                    disabled={judgeBusy || !canJudge}
                    title={
                      language !== 'typescript'
                        ? 'Judging is TypeScript-only for now'
                        : !problem.hasTests
                          ? 'No I/O cases for this problem'
                          : !runnableCode
                            ? 'No TypeScript code to run for this selection'
                            : 'Run against example cases'
                    }
                    onClick={() => runJudge('run')}
                  >
                    {judgeBusy && judgeMode === 'run' ? 'Running…' : 'Run'}
                  </button>
                  <button
                    type="button"
                    className="judge-btn judge-btn-submit"
                    disabled={judgeBusy || !canJudge}
                    title={
                      language !== 'typescript'
                        ? 'Judging is TypeScript-only for now'
                        : !problem.hasTests
                          ? 'No I/O cases for this problem'
                          : !runnableCode
                            ? 'No TypeScript code to submit for this selection'
                            : canEditCode
                              ? 'Submit against examples + edge cases'
                              : 'Submit this approach against examples + edge cases'
                    }
                    onClick={() => runJudge('submit')}
                  >
                    {judgeBusy && judgeMode === 'submit' ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
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
              ) : selectedLocal &&
                selectedLocal.source !== 'local' &&
                languageAvailableForSelection &&
                !selectedLocal.code ? (
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
              ) : solution?.code ? (
                <CodeBlock className="solution-code" language={language} code={solution.code} />
              ) : languageAvailableForSelection &&
                (problem.hasSolution || Boolean(selectedLocal)) &&
                language === 'typescript' ? (
                <pre className="solution-code">
                  <code>Loading…</code>
                </pre>
              ) : (
                <pre className="solution-code">
                  <code>No code yet — pick an Approach chip or open Your code.</code>
                </pre>
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
