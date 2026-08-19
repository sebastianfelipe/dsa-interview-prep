# Build a query in layers

Do not start at `SELECT *`. Start at the **result table the interviewer sketched**, then grow the query one clause at a time. Each layer is a legal query you can Run.

Studio problem for this page: [Top Travellers](/problems/17-sql/top-travellers) (then a second pass on [Calculate Special Bonus](/problems/17-sql/calculate-special-bonus)).

## The assembly order

SQL is not executed in the order you type it. Build it in **this** order — it matches how the engine thinks:

```text
1. FROM        which table is the universe of rows?
2. JOIN … ON   attach optional/required neighbors
3. WHERE       drop rows (before grouping)
4. GROUP BY    collapse rows into buckets
5. HAVING      drop buckets
6. SELECT      project / alias / compute columns  ← output contract
7. ORDER BY    only if the problem says so
```

`SELECT` comes last on purpose. Aliases from `SELECT` are not visible in `WHERE`. They **are** visible in `ORDER BY`.

## Layer 0 — read the output, not the tables

Problem: *report each user's travelled distance; users with no rides get 0; sort by distance desc, name asc.*

Output columns: `name`, `travelled_distance`.

Ask four questions:

| Question | Answer here |
|----------|-------------|
| Who **must** appear? | Every row in `Users` |
| Who may be missing? | Rides (Donald has none) |
| Do rows collapse? | Yes — many rides → one user |
| Does order matter? | Yes |

That is already the pattern: **LEFT JOIN + GROUP BY + COALESCE + ORDER BY**.

## Layer 1 — the universe (`FROM`)

```sql
SELECT *
FROM Users;
```

You should see Alice, Bob, Alex, Donald, Lee, Jonathan, Elvis — including Donald.

## Layer 2 — attach events (`JOIN`)

Inner join first, on purpose, so you **see** the bug:

```sql
SELECT u.name, r.distance
FROM Users u
JOIN Rides r ON r.user_id = u.id;
```

Donald disappears. Lee appears three times (100, 120, 230). That tells you two things: you need a **left** join, and you will need to **aggregate**.

```sql
SELECT u.name, r.distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id;
```

Donald is back; `distance` is `NULL` on his row.

## Layer 3 — collapse (`GROUP BY`) + compute

```sql
SELECT
  u.name,
  SUM(r.distance) AS travelled_distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id
GROUP BY u.id, u.name;
```

Lee is 450. Donald is `NULL`, not 0 — `SUM` of no rows is `NULL`.

```sql
SELECT
  u.name,
  COALESCE(SUM(r.distance), 0) AS travelled_distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id
GROUP BY u.id, u.name;
```

Group by `u.id` **and** `u.name`. Grouping only by `name` would merge two users who share a name.

## Layer 4 — output contract (`ORDER BY`, aliases)

```sql
SELECT
  u.name,
  COALESCE(SUM(r.distance), 0) AS travelled_distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id
GROUP BY u.id, u.name
ORDER BY travelled_distance DESC, u.name ASC;
```

You can `ORDER BY` the alias because `ORDER BY` runs after `SELECT`. Submit this on Top Travellers.

## Second example — no join, still layers

[Calculate Special Bonus](/problems/17-sql/calculate-special-bonus): *odd id and name not starting with M → full salary, else 0; order by id.*

Layer 1 — universe:

```sql
SELECT employee_id, name, salary FROM Employees;
```

Layer 2 — there is no second table. The "if" is a **computed column**:

```sql
SELECT
  employee_id,
  CASE
    WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary
    ELSE 0
  END AS bonus
FROM Employees
ORDER BY employee_id;
```

Same pipeline: `FROM` → `SELECT` (expression) → `ORDER BY`. `WHERE` would have **dropped** the even-id rows; the problem wants them with `bonus = 0`, so the condition belongs in `CASE`, not `WHERE`.

## The LEFT JOIN + WHERE trap (preview)

On [Market Analysis I](/problems/17-sql/market-analysis-i) you must count **2019** orders per user, including zeros.

Wrong — `WHERE` runs after the join and kills unmatched users:

```sql
FROM Users u
LEFT JOIN Orders o ON o.buyer_id = u.user_id
WHERE o.order_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
```

Right — the year filter is part of **matching**, not of **keeping**:

```sql
FROM Users u
LEFT JOIN Orders o
  ON o.buyer_id = u.user_id
 AND o.order_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
```

Then `COUNT(o.order_id)` (not `COUNT(*)`) so a leftover user counts as 0.

Walk that one the same way: `FROM Users` → left join with the year in `ON` → `GROUP BY u.user_id` → alias `buyer_id`.

## Checklist before Submit

1. Every required output column is aliased **exactly**.
2. The driving table is in `FROM` (the one that must survive).
3. Optional-table filters are in `ON` if you left-joined.
4. Aggregates use `COUNT(pk)` / `COALESCE(SUM(…), 0)` when zeros matter.
5. `ORDER BY` only when the spec asks.

## Next

When a layer would be "find the min year **then** keep those sales", you need a **nested query** or a CTE — [Nested queries](/reference/resources/sql/02-nested-queries).
