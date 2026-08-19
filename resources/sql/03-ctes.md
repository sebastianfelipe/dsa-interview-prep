# CTEs (`WITH`) — named nested queries

A CTE (common table expression) is a nested query with a **name**. The engine still computes an inner table; you just stop parenthesizing in `FROM`.

Studio: rewrite [Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv), then build [Restaurant Growth](/problems/17-sql/restaurant-growth) as two named layers.

## One CTE

This nested form:

```sql
FROM Activity a
JOIN (
  SELECT player_id, MIN(event_date) AS first_login
  FROM Activity
  GROUP BY player_id
) f ON …
```

is this CTE:

```sql
WITH first_login AS (
  SELECT player_id, MIN(event_date) AS first_login
  FROM Activity
  GROUP BY player_id
)
SELECT ROUND(
  COUNT(DISTINCT a.player_id)::numeric
    / (SELECT COUNT(DISTINCT player_id) FROM Activity),
  2
) AS fraction
FROM Activity a
JOIN first_login f
  ON a.player_id = f.player_id
 AND a.event_date = f.first_login + 1;
```

Read it top-down: *define first_login, then use it like a real table.* In an interview, say the CTE name out loud — it is the "first event" pattern.

You can still mix in a scalar subquery for the denominator; it is a different slot (one number, not a table).

## Stacking CTEs (the moving-average construction)

[Restaurant Growth](/problems/17-sql/restaurant-growth): *7-day moving average of **daily** revenue, starting on the 7th day of business.*

English has **two** collapses. If you window the raw `Customer` table, two customers on the same day each become a "day" in a `ROWS` frame and the math is wrong. Name the layers.

**CTE 1 — one row per calendar day:**

```sql
WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
)
SELECT * FROM daily ORDER BY visited_on;
```

Run this by itself (drop the later CTEs). Example: 2019-01-01 → 100, …, 2019-01-10 → 280 (Jhon 130 + Jade 150).

**CTE 2 — window on that daily table, not on raw visits:**

```sql
WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
),
windowed AS (
  SELECT
    visited_on,
    SUM(amount) OVER w AS amount,
    ROUND(SUM(amount) OVER w / 7.0, 2) AS average_amount
  FROM daily
  WINDOW w AS (
    ORDER BY visited_on
    RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
  )
)
SELECT visited_on, amount, average_amount
FROM windowed
WHERE visited_on >= (SELECT MIN(visited_on) + 6 FROM daily)
ORDER BY visited_on;
```

Why `RANGE` + `INTERVAL '6 days'` instead of `ROWS BETWEEN 6 PRECEDING`:

- `ROWS` = "6 previous **rows** in the sorted table".
- `RANGE` = "rows whose `visited_on` falls in the last 6 calendar days plus today".

If a day has no customers, `ROWS` would secretly borrow a different day. `RANGE` stays honest.

`/ 7.0` (not `/ 7`) avoids integer truncation before `ROUND`.

## Rules

- A CTE is only visible **below** it in the same `WITH` list and in the final `SELECT`.
- Later CTEs can read earlier ones (`windowed` reads `daily`).
- You do **not** need a CTE for a one-line `IN` subquery. Use `WITH` when the inner table is reused or when you would nest two deep.
- `WINDOW w AS (…)` is optional sugar so the two `SUM(…) OVER w` share one frame.

## Practice

1. Take your working Game Play Analysis IV query and lift the inner `MIN(event_date)` into `WITH first_login AS (…)` — Submit should still pass.
2. On Restaurant Growth, Run **only** `WITH daily AS (…) SELECT * FROM daily` in your head, then add the window.

Next: [Join vs nest](/reference/resources/sql/04-join-vs-nest) — same layers, two spellings.
