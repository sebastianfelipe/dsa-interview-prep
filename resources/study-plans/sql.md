# SQL Prep (this list)

Walk the studio [SQL Prep List](/lists) (**Lists → SQL Prep List**), or start at [Calculate Special Bonus](/problems/17-sql/calculate-special-bonus?list=sql-dpmjh4yr). One sitting ≈ 45–75 minutes.

Read [How to build queries](/reference/resources/sql) before the first sitting (layers, nested queries, CTEs). Keep the [Postgres cheat sheet](/reference/resources/cheat-sheets/sql-postgres) beside the editor after that.

## Session shape

1. Read the pattern (5 min)
2. Timed query on the linked problem — Hint if stuck, not the full solution
3. Run / Submit, then **Help with my code** on the first failure
4. Write one Key Extract in your notes

## Order

| # | Pattern | Problem | Goal |
|---|---------|---------|------|
| 1 | [CASE WHEN](/reference/topics/17-sql/patterns/case-when) | [Calculate Special Bonus](/problems/17-sql/calculate-special-bonus) | Conditional column |
| 2 | [GROUP BY + HAVING](/reference/topics/17-sql/patterns/group-by-having) | [Classes With at Least 5 Students](/problems/17-sql/classes-with-at-least-5-students) | Filter groups, not rows |
| 3 | [LEFT JOIN](/reference/topics/17-sql/patterns/left-join) | [Top Travellers](/problems/17-sql/top-travellers) | Zeros must appear |
| 4 | [Anti-join](/reference/topics/17-sql/patterns/anti-join) | [Customer Who Visited but Did Not Make Any Transactions](/problems/17-sql/customer-who-visited-but-did-not-make-any-transactions) | Absence of a match |
| 5 | [Self-join on dates](/reference/topics/17-sql/patterns/self-join-dates) | [Rising Temperature](/problems/17-sql/rising-temperature) | Yesterday ≠ previous row |
| 6 | [LEFT JOIN](/reference/topics/17-sql/patterns/left-join) | [Market Analysis I](/problems/17-sql/market-analysis-i) | Year filter in `ON` |
| 7 | [First event](/reference/topics/17-sql/patterns/first-event) | [Product Sales Analysis III](/problems/17-sql/product-sales-analysis-iii) | Min year, then all matching sales |
| 8 | [First event](/reference/topics/17-sql/patterns/first-event) | [Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv) | First login + next day; `::numeric` |
| 9 | [Windows](/reference/topics/17-sql/patterns/window-functions) | [Rank Scores](/problems/17-sql/rank-scores) | `DENSE_RANK` |
| 10 | [Windows](/reference/topics/17-sql/patterns/window-functions) | [Restaurant Growth](/problems/17-sql/restaurant-growth) | 7-day `RANGE` frame |

## After the list

Re-solve #3, #6, and #8 from a blank editor — those three mix left joins, filters, and dates, which is what interviews actually ask.

## Key Extract

SQL interviews are pattern recognition on the **output table**, then clause assembly. Don't start from `SELECT *`.
