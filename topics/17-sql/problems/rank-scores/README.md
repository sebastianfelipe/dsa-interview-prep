# Rank Scores

Table: `Scores`

| Column | Type          |
| ------ | ------------- |
| id     | int           |
| score  | decimal(3, 2) |

`id` is the primary key. Each row contains the score of one game.

Write a query to **rank the scores**, following these rules:

- Scores are ranked from **highest to lowest**.
- Equal scores receive the **same rank**.
- After a tie, the next rank is the **next consecutive integer** — there are no gaps
  ("dense" ranking).

Return the result table with columns `score, rank`, ordered by `score` **descending**.

## Example

Input — `Scores`:

| id  | score |
| --- | ----- |
| 1   | 3.50  |
| 2   | 3.65  |
| 3   | 4.00  |
| 4   | 3.85  |
| 5   | 4.00  |
| 6   | 3.65  |

Output:

| score | rank |
| ----- | ---- |
| 4.00  | 1    |
| 4.00  | 1    |
| 3.85  | 2    |
| 3.65  | 3    |
| 3.65  | 3    |
| 3.50  | 4    |

## Notes

- "Same rank for ties, no gaps afterwards" is exactly `DENSE_RANK()` — `RANK()` would jump from
  1, 1 to 3.
- The window is `OVER (ORDER BY score DESC)`; the outer `ORDER BY score DESC` orders the rows.
- `rank` is easiest to emit quoted in Postgres: `AS "rank"`.
