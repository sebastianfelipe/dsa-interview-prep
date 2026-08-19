# Pattern: Window Functions

## Recognition

- Rank, running total, moving average, "vs previous row" **without collapsing rows**
- `GROUP BY` would lose the detail you still need to return
- Ties: "same score → same rank, **no gaps**" → `DENSE_RANK`; gaps after ties → `RANK`

## Idea

`OVER (ORDER BY …)` computes an aggregate **per row**, looking at a window of peers.

```sql
SELECT
  score,
  DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM Scores
ORDER BY score DESC;
```

Moving 7-day total (date-based frame, not "6 previous rows"):

```sql
SUM(amount) OVER (
  ORDER BY visited_on
  RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
)
```

`RANGE` + a date interval stays correct if some days are missing; `ROWS BETWEEN 6 PRECEDING` does not.

## Pitfalls

- `RANK` vs `DENSE_RANK` vs `ROW_NUMBER` — interviewers expect you to name the difference.
- Window frames default to `RANGE UNBOUNDED PRECEDING AND CURRENT ROW` for aggregates with `ORDER BY`. Spell the frame when the problem is a sliding window.
- `ROUND(x / 7.0, 2)` — divide by a numeric, not an int, or Postgres truncates.

## Studio

- [Rank Scores](/problems/17-sql/rank-scores)
- [Restaurant Growth](/problems/17-sql/restaurant-growth)

## Key Extract

**Windows compute without collapsing.** Use `GROUP BY` when each group becomes one row; use `OVER` when you still want every input row (or every day) back.
