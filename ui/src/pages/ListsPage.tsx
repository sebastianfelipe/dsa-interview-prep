import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type ListDetail, type ListSummary } from '../api';
import {
  listProblemProgress,
  subscribeProblemProgress,
  type ProblemProgress,
  type ProblemProgressStatus,
} from '../problem-progress';
import { readLastListId, writeLastListId } from '../studio-nav';

function progressStatusFor(
  progress: Record<string, ProblemProgress>,
  topic: string | null,
  slug: string,
): ProblemProgressStatus | undefined {
  if (topic) {
    const direct = progress[`${topic}/${slug}`]?.status;
    if (direct) return direct;
  }
  for (const [key, value] of Object.entries(progress)) {
    if (key === slug || key.endsWith(`/${slug}`)) return value.status;
  }
  return undefined;
}

function statusLabel(status: ProblemProgressStatus | undefined, covered: boolean) {
  if (status === 'passed') return 'Passed';
  if (status === 'attempted') return 'Attempted';
  if (covered) return 'Not started';
  return 'Missing';
}

function statusClass(status: ProblemProgressStatus | undefined, covered: boolean) {
  if (status === 'passed') return 'status-dot ok';
  if (status === 'attempted') return 'status-dot attempted';
  if (covered) return 'status-dot idle';
  return 'status-dot missing';
}

export function ListsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const listParam = searchParams.get('list');
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [selected, setSelected] = useState<ListDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, ProblemProgress>>(() =>
    listProblemProgress(),
  );

  useEffect(() => {
    api
      .lists()
      .then(setLists)
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (lists.length === 0) return;
    const known = (id: string | null) => Boolean(id && lists.some((l) => l.id === id));
    const id = known(listParam)
      ? listParam!
      : known(readLastListId())
        ? readLastListId()!
        : lists[0].id;
    if (listParam !== id) {
      setSearchParams({ list: id }, { replace: true });
      return;
    }
    writeLastListId(id);
    let cancelled = false;
    api
      .list(id)
      .then((detail) => {
        if (!cancelled) setSelected(detail);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [lists, listParam, setSearchParams]);

  useEffect(() => {
    const sync = () => setProgress(listProblemProgress());
    sync();
    return subscribeProblemProgress(sync);
  }, []);

  // Refresh when returning to this tab after solving a problem.
  useEffect(() => {
    const onFocus = () => setProgress(listProblemProgress());
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  function pick(id: string) {
    setSearchParams({ list: id });
    setProgress(listProblemProgress());
  }

  const learnerStats = useMemo(() => {
    if (!selected) return { passed: 0, attempted: 0, notStarted: 0, missing: 0 };
    let passed = 0;
    let attempted = 0;
    let notStarted = 0;
    let missing = 0;
    for (const p of selected.problems) {
      const status = progressStatusFor(progress, p.topic, p.slug);
      if (status === 'passed') passed += 1;
      else if (status === 'attempted') attempted += 1;
      else if (p.covered && p.topic) notStarted += 1;
      else missing += 1;
    }
    return { passed, attempted, notStarted, missing };
  }, [selected, progress]);

  if (error) return <main className="page">{error}</main>;
  if (!lists.length) return <main className="page">Loading…</main>;

  const passPct = selected
    ? Math.round((learnerStats.passed / Math.max(selected.total, 1)) * 100)
    : 0;

  return (
    <main className="page">
      <h1 className="topic-title">Prep lists</h1>
      <p className="muted">Track passed and attempted problems on your prep lists.</p>

      <div className="filters" style={{ marginTop: '1.25rem' }}>
        {lists.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`chip ${selected?.id === l.id ? 'active' : ''}`}
            onClick={() => pick(l.id)}
          >
            {l.title} ({l.covered}/{l.total})
          </button>
        ))}
      </div>

      {selected && (
        <div className="panel coverage-grid" style={{ marginTop: '1rem' }}>
          <div>
            <h3>{selected.title}</h3>
            <p className="muted">
              {learnerStats.passed} passed · {learnerStats.attempted} attempted ·{' '}
              {learnerStats.notStarted} not started
              {learnerStats.missing > 0 ? ` · ${learnerStats.missing} missing` : ''}
              {selected.id === 'sql-dpmjh4yr' ? (
                <>
                  {' · '}
                  <Link to="/reference/resources/sql/README">SQL study notes</Link>
                </>
              ) : null}
              {' · '}
              <a href={selected.url} target="_blank" rel="noreferrer">
                Open on LeetCode
              </a>
            </p>
            <div
              className="progress progress-learner"
              title={`${learnerStats.passed} of ${selected.total} passed`}
            >
              <span style={{ width: `${passPct}%` }} />
            </div>
            <p className="muted" style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
              {selected.covered}/{selected.total} available in Studio
            </p>
          </div>

          <div>
            {selected.problems.map((p) => {
              const status = progressStatusFor(progress, p.topic, p.slug);
              const label = statusLabel(status, p.covered);
              const className = statusClass(status, p.covered);

              if (p.covered && p.topic) {
                return (
                  <Link
                    key={p.slug}
                    className={`list-item list-item-link${status ? ` is-${status}` : ''}`}
                    to={`/problems/${p.topic}/${p.slug}?list=${encodeURIComponent(selected.id)}`}
                  >
                    <div>
                      <strong>
                        {p.leetcodeId}. {p.title}
                      </strong>
                      <div className="muted">{p.difficulty}</div>
                    </div>
                    <span className={className}>
                      {label}
                      {' →'}
                    </span>
                  </Link>
                );
              }

              return (
                <div key={p.slug} className="list-item">
                  <div>
                    <strong>
                      {p.leetcodeId}. {p.title}
                    </strong>
                    <div className="muted">{p.difficulty}</div>
                  </div>
                  <span className={className}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
