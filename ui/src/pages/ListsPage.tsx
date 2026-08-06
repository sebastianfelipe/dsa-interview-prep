import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type ListDetail, type ListSummary } from '../api';

export function ListsPage() {
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [selected, setSelected] = useState<ListDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .lists()
      .then(async (ls) => {
        setLists(ls);
        if (ls[0]) setSelected(await api.list(ls[0].id));
      })
      .catch((e) => setError(String(e)));
  }, []);

  async function pick(id: string) {
    setSelected(await api.list(id));
  }

  if (error) return <main className="page">{error}</main>;
  if (!lists.length) return <main className="page">Loading…</main>;

  return (
    <main className="page">
      <h1 className="topic-title">Prep lists</h1>
      <p className="muted">Coverage against your Easy and Medium LeetCode lists.</p>

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
              {selected.covered}/{selected.total} with solutions ·{' '}
              <a href={selected.url} target="_blank" rel="noreferrer">
                Open on LeetCode
              </a>
            </p>
            <div className="progress">
              <span style={{ width: `${(selected.covered / selected.total) * 100}%` }} />
            </div>
          </div>

          <div>
            {selected.problems.map((p) =>
              p.covered && p.topic ? (
                <Link
                  key={p.slug}
                  className="list-item list-item-link"
                  to={`/problems/${p.topic}/${p.slug}`}
                >
                  <div>
                    <strong>
                      {p.leetcodeId}. {p.title}
                    </strong>
                    <div className="muted">{p.difficulty}</div>
                  </div>
                  <span className="status-dot ok">Covered →</span>
                </Link>
              ) : (
                <div key={p.slug} className="list-item">
                  <div>
                    <strong>
                      {p.leetcodeId}. {p.title}
                    </strong>
                    <div className="muted">{p.difficulty}</div>
                  </div>
                  <span className="status-dot missing">Missing</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </main>
  );
}
