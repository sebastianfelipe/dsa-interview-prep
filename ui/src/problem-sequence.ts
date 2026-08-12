import type { Catalog, ListDetail, ProblemSummary } from './api';

function compareProblems(a: ProblemSummary, b: ProblemSummary): number {
  const aId = a.leetcodeId ?? Number.POSITIVE_INFINITY;
  const bId = b.leetcodeId ?? Number.POSITIVE_INFINITY;
  if (aId !== bId) return aId - bId;
  return a.title.localeCompare(b.title);
}

/** Flatten catalog into a linear study order: topics in order, problems by LC id. */
export function flattenCatalogProblems(catalog: Catalog): ProblemSummary[] {
  return catalog.topics.flatMap((topic) => [...topic.problems].sort(compareProblems));
}

/**
 * List order for navigation. Only covered problems with a topic can be opened;
 * missing list items are skipped so Next always lands on a workable problem.
 */
export function flattenListProblems(list: ListDetail): ProblemSummary[] {
  return list.problems
    .filter((p): p is typeof p & { topic: string; covered: true } => Boolean(p.covered && p.topic))
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      leetcodeId: p.leetcodeId,
      difficulty: p.difficulty as ProblemSummary['difficulty'],
      topic: p.topic,
      topicTitle: list.title,
      hasSolution: true,
      hasTests: true,
      path: '',
    }));
}

export function findProblemNeighbors(
  sequence: ProblemSummary[],
  topic: string,
  slug: string,
): {
  index: number;
  total: number;
  previous: ProblemSummary | null;
  next: ProblemSummary | null;
} {
  const index = sequence.findIndex((p) => p.topic === topic && p.slug === slug);
  if (index < 0) {
    return { index: -1, total: sequence.length, previous: null, next: null };
  }
  return {
    index,
    total: sequence.length,
    previous: sequence[index - 1] ?? null,
    next: sequence[index + 1] ?? null,
  };
}

export function problemPath(topic: string, slug: string, listId?: string | null): string {
  const base = `/problems/${topic}/${slug}`;
  return listId ? `${base}?list=${encodeURIComponent(listId)}` : base;
}
