import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type Catalog, type Difficulty } from '../api';

const ALL: Difficulty | 'All' = 'All';

export function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const difficulty = (params.get('difficulty') as Difficulty | null) ?? undefined;
  const topicId = params.get('topic') ?? '';
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .catalog()
      .then(setCatalog)
      .catch((e) => setError(String(e)));
  }, []);

  const topics = useMemo(
    () => (catalog?.topics ?? []).filter((t) => t.problems.length > 0),
    [catalog],
  );
  const activeTopic = topics.find((t) => t.id === topicId) ?? topics[0];

  const problems = useMemo(() => {
    if (!activeTopic) return [];
    if (!difficulty) return activeTopic.problems;
    return activeTopic.problems.filter((p) => p.difficulty === difficulty);
  }, [activeTopic, difficulty]);

  function setDifficulty(d: Difficulty | 'All') {
    const next = new URLSearchParams(params);
    if (d === 'All') next.delete('difficulty');
    else next.set('difficulty', d);
    setParams(next);
  }

  function setTopic(id: string) {
    const next = new URLSearchParams(params);
    next.set('topic', id);
    setParams(next);
  }

  if (error) return <main className="page">Failed to load catalog: {error}</main>;
  if (!catalog || !activeTopic) return <main className="page">Loading…</main>;

  return (
    <main className="page page-split">
      <div className="filters">
        {([ALL, 'Easy', 'Medium', 'Hard'] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={`chip ${(!difficulty && d === 'All') || difficulty === d ? 'active' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="layout-split layout-split-fixed">
        <aside className="sidebar">
          <h2>Topics</h2>
          <div className="sidebar-scroll">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`linkish ${activeTopic.id === t.id ? 'active' : ''}`}
                onClick={() => setTopic(t.id)}
              >
                {t.title}
              </button>
            ))}
          </div>
        </aside>

        <section className="content-pane">
          <h1 className="topic-title">{activeTopic.title}</h1>
          <p className="muted">
            {problems.length} problem{problems.length === 1 ? '' : 's'}
            {difficulty ? ` · ${difficulty}` : ''}
          </p>

          <div className="problem-list" style={{ marginTop: '1.25rem' }}>
            {problems.map((p) => (
              <Link key={p.slug} className="problem-row" to={`/problems/${p.topic}/${p.slug}`}>
                <span className={`badge ${p.difficulty}`}>{p.difficulty}</span>
                <span>
                  <strong>{p.title}</strong>
                  {p.leetcodeId != null && <span className="muted"> · LC {p.leetcodeId}</span>}
                </span>
                <span className="muted">{p.hasTests ? 'tests' : 'no tests'}</span>
              </Link>
            ))}
            {problems.length === 0 && <p className="muted">No problems for this filter.</p>}
          </div>

          {activeTopic.patterns.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 className="topic-title" style={{ fontSize: '1.25rem' }}>
                Patterns
              </h2>
              <div className="problem-list" style={{ marginTop: '0.75rem' }}>
                {activeTopic.patterns.map((p) => (
                  <Link
                    key={p.slug}
                    className="problem-row"
                    to={`/reference/topics/${activeTopic.id}/patterns/${p.slug}`}
                  >
                    <span className="badge Easy">Pattern</span>
                    <span>
                      <strong>{p.title}</strong>
                    </span>
                    <span className="muted">read</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
