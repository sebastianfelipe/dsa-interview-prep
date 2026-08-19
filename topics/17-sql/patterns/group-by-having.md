# Pattern: GROUP BY + HAVING

## Recognition

- "Classes with **at least** 5 students", "users who placed **more than** N orders"
- The filter is on an **aggregate**, not on a raw row

## Idea

`WHERE` filters rows **before** grouping. `HAVING` filters groups **after** `GROUP BY`.

```sql
SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(student) >= 5;
```

## Pitfalls

- `WHERE COUNT(*) >= 5` is invalid — aggregates are not visible yet.
- `COUNT(*)` vs `COUNT(col)`: the latter skips `NULL`s. If the column is a PK, they match.
- Every non-aggregated `SELECT` column must appear in `GROUP BY` (Postgres is strict).

## Studio

- [Classes With at Least 5 Students](/problems/17-sql/classes-with-at-least-5-students)

## Key Extract

**Row filter → `WHERE`. Group filter → `HAVING`.** If the sentence has "per X, at least N", you need both `GROUP BY X` and `HAVING`.
