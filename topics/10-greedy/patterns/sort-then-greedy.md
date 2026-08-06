# Pattern: Sort Then Greedy

## Recognition

- Assign cookies, meeting rooms, video stitching
- Interval scheduling (earliest end first)

## Idea

Sort by a key (end time, start, ratio), then scan once taking non-conflicting choices.

## Key Extract

Choosing the sort key **is** the algorithm. Wrong key → wrong greedy.
