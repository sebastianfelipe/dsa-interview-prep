import { Link } from 'react-router-dom';
import type { ProblemSummary } from '../api';
import { problemPath } from '../problem-sequence';

export function ProblemNav({
  previous,
  next,
  index,
  total,
  listId,
  label,
}: {
  previous: ProblemSummary | null;
  next: ProblemSummary | null;
  index: number;
  total: number;
  listId?: string | null;
  label?: string | null;
}) {
  if (total === 0) return null;

  return (
    <nav className="problem-nav" aria-label={label ? `${label} sequence` : 'Problem sequence'}>
      {previous ? (
        <Link
          className="problem-nav-link problem-nav-prev"
          to={problemPath(previous.topic, previous.slug, listId)}
        >
          <span className="problem-nav-dir">Previous</span>
          <span className="problem-nav-title">{previous.title}</span>
        </Link>
      ) : (
        <span className="problem-nav-link problem-nav-prev is-disabled" aria-disabled="true">
          <span className="problem-nav-dir">Previous</span>
          <span className="problem-nav-title">Start of sequence</span>
        </span>
      )}

      <div className="problem-nav-position muted">
        {label && <div className="problem-nav-source">{label}</div>}
        <div>{index >= 0 ? `${index + 1} / ${total}` : `— / ${total}`}</div>
      </div>

      {next ? (
        <Link
          className="problem-nav-link problem-nav-next"
          to={problemPath(next.topic, next.slug, listId)}
        >
          <span className="problem-nav-dir">Next</span>
          <span className="problem-nav-title">{next.title}</span>
        </Link>
      ) : (
        <span className="problem-nav-link problem-nav-next is-disabled" aria-disabled="true">
          <span className="problem-nav-dir">Next</span>
          <span className="problem-nav-title">End of sequence</span>
        </span>
      )}
    </nav>
  );
}
