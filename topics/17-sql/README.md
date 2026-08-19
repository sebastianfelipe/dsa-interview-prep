# SQL & Databases

LeetCode-style database problems: instead of implementing a function, you write one
**PostgreSQL query** that produces the expected result table.

## Study material

| Resource | Where |
|----------|--------|
| **[How to build queries](/reference/resources/sql)** | layered assembly, nested queries, CTEs — start here |
| Patterns (this topic) | table below, also **Reference → SQL & Databases — Patterns** |
| [Postgres cheat sheet](/reference/resources/cheat-sheets/sql-postgres) | dialect reminder after you can assemble a query |
| [Query skeletons](/reference/resources/templates/sql) | copy-paste starters |
| [SQL prep plan](/reference/resources/study-plans/sql) | the 10-problem list in pattern order |

## How it works here

- The **Problem** pane shows the table schemas, example input tables, and the expected output.
- Write your query in the code console (language: SQL) and hit **Run** / **Submit**.
- The judge seeds an embedded Postgres database with each case's data, runs your query, and
  compares your result set to the reference query's output — column names included, so alias
  your output columns exactly as the problem asks.
- Row order only matters when the problem specifies an `ORDER BY`.

## Patterns

| Pattern | When |
|---------|------|
| [CASE WHEN](/reference/topics/17-sql/patterns/case-when) | Conditional output column |
| [LEFT JOIN keep unmatched](/reference/topics/17-sql/patterns/left-join) | Every entity must appear, including zeros |
| [Anti-join](/reference/topics/17-sql/patterns/anti-join) | Rows with **no** matching event |
| [GROUP BY + HAVING](/reference/topics/17-sql/patterns/group-by-having) | Filter on a count / sum |
| [Self-join on dates](/reference/topics/17-sql/patterns/self-join-dates) | Yesterday / next calendar day |
| [First event per group](/reference/topics/17-sql/patterns/first-event) | Earliest year/login, then matching rows |
| [Window functions](/reference/topics/17-sql/patterns/window-functions) | Rank, moving average without collapsing |

## Dialect notes

The judge runs **PostgreSQL**. If you're used to MySQL:

- `DATEDIFF(a, b)` → in Postgres, `a - b` on `DATE` columns already yields days; `date + 1` adds a day.
- `IFNULL(x, y)` → `COALESCE(x, y)`.
- Integer division truncates — cast first: `COUNT(*)::numeric / total`.
- `ROUND(value, 2)` needs a `numeric`, not a `double precision`.

## Key Extract

Read the **output table** first: who must appear, who must vanish, what collapses, what stays and gains a rank. That choice is the pattern.
