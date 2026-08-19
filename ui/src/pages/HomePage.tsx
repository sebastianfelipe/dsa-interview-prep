import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="hero-mark-frame" aria-hidden="true">
          <img className="hero-mark" src="/logo.png" alt="" width={72} height={72} />
        </span>
        <h1>
          DSA Studio <span className="brand-gradient-text">AI</span>
        </h1>
        <p className="hero-tagline">
          <span className="hero-tagline-rule" aria-hidden="true" />
          <span>Master DSA. Crack Interviews.</span>
          <span className="hero-tagline-rule" aria-hidden="true" />
        </p>
        <p>
          Pattern-first interview prep. Read the recognition signals, study the approach, then reveal
          a solution when you are ready.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/browse">
            Start studying
          </Link>
          <Link className="btn btn-ghost" to="/lists">
            Prep lists
          </Link>
          <Link className="btn btn-ghost" to="/reference/resources/sql/README">
            SQL notes
          </Link>
        </div>
      </section>
    </main>
  );
}
