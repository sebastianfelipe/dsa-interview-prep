# Intervals

Sort intervals, then merge / sweep / greedy select.

## Patterns

| Pattern | File |
|---------|------|
| Merge / insert | [patterns/merge.md](./patterns/merge.md) |
| Sweep line | [patterns/sweep-line.md](./patterns/sweep-line.md) |

## Worked problems

| Problem | File |
|---------|------|
| Merge Intervals | [problems/merge-intervals.md](./problems/merge-intervals.md) |
| Meeting Rooms II | [problems/meeting-rooms-ii.md](./problems/meeting-rooms-ii.md) |

## Key Extract

Sort by start (merge) or process start/end events (rooms needed). Overlap test: `a.start < b.end && b.start < a.end`.
