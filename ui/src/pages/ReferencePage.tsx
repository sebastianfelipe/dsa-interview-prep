import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Markdown } from '../components/Markdown';

export function ReferencePage() {
  const params = useParams();
  const docPath = params['*'] ?? '';
  const [index, setIndex] = useState<
    { id: string; title: string; docs: { path: string; title: string }[] }[] | null
  >(null);
  const [doc, setDoc] = useState<{ title: string; markdown: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .docsIndex()
      .then((d) => setIndex(d.sections))
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!docPath) {
      setDoc(null);
      return;
    }
    api
      .doc(docPath)
      .then((d) => setDoc({ title: d.title, markdown: d.markdown }))
      .catch((e) => setError(String(e)));
  }, [docPath]);

  if (error) return <main className="page">{error}</main>;
  if (!index) return <main className="page">Loading…</main>;

  return (
    <main className="page page-split">
      <div className="layout-split layout-split-fixed">
        <aside className="sidebar">
          {index.map((section) => (
            <div key={section.id} style={{ marginBottom: '1.25rem' }}>
              <h2>{section.title}</h2>
              {section.docs.map((d) => (
                <Link
                  key={d.path}
                  to={`/reference/${d.path}`}
                  className={docPath === d.path ? 'active' : ''}
                >
                  {d.title}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <section className="panel content-pane">
          {doc ? (
            <Markdown source={doc.markdown} />
          ) : (
            <p className="muted">Pick a reference doc from the sidebar.</p>
          )}
        </section>
      </div>
    </main>
  );
}
