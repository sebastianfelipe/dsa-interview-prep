import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <h1>DSA Studio AI</h1>
        <p>
          Pattern-first interview prep. Read the recognition signals, reveal a TypeScript solution
          when you are ready, and run the tests.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/browse">
            Start studying
          </Link>
          <Link className="btn btn-ghost" to="/lists">
            Easy & Medium lists
          </Link>
        </div>
      </section>
    </main>
  );
}
