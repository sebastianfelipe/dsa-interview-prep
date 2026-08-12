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
    <nav
      className="problem-nav-inline"
      aria-label={label ? `${label} sequence` : 'Problem sequence'}
    >
      {previous ? (
        <Link
          className="problem-nav-step"
          to={problemPath(previous.topic, previous.slug, listId)}
          title={previous.title}
          aria-label={`Previous: ${previous.title}`}
        >
          ←
        </Link>
      ) : (
        <span className="problem-nav-step is-disabled" aria-disabled="true">
          ←
        </span>
      )}

      <span className="problem-nav-count" title={label ?? undefined}>
        {index >= 0 ? `${index + 1}/${total}` : `—/${total}`}
      </span>

      {next ? (
        <Link
          className="problem-nav-step"
          to={problemPath(next.topic, next.slug, listId)}
          title={next.title}
          aria-label={`Next: ${next.title}`}
        >
          →
        </Link>
      ) : (
        <span className="problem-nav-step is-disabled" aria-disabled="true">
          →
        </span>
      )}
    </nav>
  );
}
