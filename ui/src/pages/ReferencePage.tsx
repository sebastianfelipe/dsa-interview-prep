import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { Markdown } from '../components/Markdown';

const LAST_REFERENCE_KEY = 'dsa-studio-last-reference';

type DocIndexSection = {
  id: string;
  title: string;
  docs: { path: string; title: string }[];
};

function readLastReference(): string | null {
  try {
    return sessionStorage.getItem(LAST_REFERENCE_KEY);
  } catch {
    return null;
  }
}

function writeLastReference(path: string) {
  try {
    sessionStorage.setItem(LAST_REFERENCE_KEY, path);
  } catch {
    /* ignore */
  }
}

function flattenDocs(sections: DocIndexSection[]) {
  return sections.flatMap((section) => section.docs);
}

export function ReferencePage() {
  const params = useParams();
  const navigate = useNavigate();
  const docPath = params['*'] ?? '';
  const [index, setIndex] = useState<DocIndexSection[] | null>(null);
  const [doc, setDoc] = useState<{ title: string; markdown: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .docsIndex()
      .then((d) => setIndex(d.sections))
      .catch((e) => setError(String(e)));
  }, []);

  // Remember the current doc for this browser session (survives leaving for an exercise).
  useEffect(() => {
    if (docPath) writeLastReference(docPath);
  }, [docPath]);

  // Empty /reference → restore last session pick, else open the first doc.
  useEffect(() => {
    if (!index || docPath) return;

    const docs = flattenDocs(index);
    if (docs.length === 0) return;

    const last = readLastReference();
    const target = last && docs.some((d) => d.path === last) ? last : docs[0].path;
    navigate(`/reference/${target}`, { replace: true });
  }, [index, docPath, navigate]);

  useEffect(() => {
    if (!docPath) {
      setDoc(null);
      return;
    }
    let cancelled = false;
    api
      .doc(docPath)
      .then((d) => {
        if (!cancelled) setDoc({ title: d.title, markdown: d.markdown });
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [docPath]);

  if (error) return <main className="page">{error}</main>;
  if (!index) return <main className="page">Loading…</main>;
  if (!docPath) return <main className="page">Loading…</main>;

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
            <p className="muted">Loading…</p>
          )}
        </section>
      </div>
    </main>
  );
}
