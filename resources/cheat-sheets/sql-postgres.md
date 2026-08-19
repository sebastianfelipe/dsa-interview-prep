# PostgreSQL SQL Cheat Sheet

Judge dialect is **PostgreSQL**. Keep this open while writing queries.

Worked constructions (layers, nesting, CTEs): [SQL — how to build queries](/reference/resources/sql).
Patterns: [SQL & Databases](/reference/topics/17-sql/patterns/case-when).

## Clause order

```sql
SELECT …
FROM …
JOIN … ON …
WHERE …          -- row filter (before grouping)
GROUP BY …
HAVING …         -- group filter (after grouping)
WINDOW …
ORDER BY …
```

## Joins

| Need | Write |
|------|--------|
| Only matches | `INNER JOIN` / `JOIN` |
| Keep left rows with 0 matches | `LEFT JOIN` + `COALESCE` / `COUNT(right.pk)` |
| Rows in A with no B | Left join + `WHERE b.pk IS NULL` (anti-join) |
| Compare a row to another in the same table | Self-join on `a.date = b.date + 1` |

Put **right-table filters in `ON`** when you left-join. `WHERE right.col = …` drops the unmatched left rows.

## Aggregates

| Want | Use |
|------|-----|
| Rows per group | `COUNT(*)` |
| Non-null values / matched right rows | `COUNT(col)` |
| Empty group after left join | `COALESCE(SUM(x), 0)` |
| Filter groups | `HAVING COUNT(*) >= 5` |
| Fraction, 2 decimals | `ROUND(a::numeric / b, 2)` |

## Windows

| Spec | Function |
|------|----------|
| Ties share rank, no gaps | `DENSE_RANK() OVER (ORDER BY score DESC)` |
| Ties share rank, gaps | `RANK() OVER (…)` |
| Unique order | `ROW_NUMBER() OVER (…)` |
| 7 calendar days including today | `SUM(x) OVER (ORDER BY d RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW)` |

## Dates (Postgres vs MySQL)

| MySQL | Postgres |
|-------|----------|
| `DATEDIFF(a, b) = 1` | `a = b + 1` on `DATE` |
| `DATE_ADD(d, INTERVAL 1 DAY)` | `d + 1` |
| `IFNULL(x, y)` | `COALESCE(x, y)` |
| `IF(cond, a, b)` | `CASE WHEN cond THEN a ELSE b END` |

## Output contract

- Alias columns to the **exact** names in the expected table (`AS bonus`, `AS "rank"`).
- `ORDER BY` only when the problem says so (the studio then checks row order).
- One statement: a `SELECT` (CTEs/`WITH` are fine).

## Key Extract

Read the output table first: which rows **must** appear (left join), which must **disappear** (anti-join), which collapse (group), which stay but gain a rank (window).
