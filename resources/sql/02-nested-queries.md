# Nested queries

A nested query is a `SELECT` that **produces a table** (or one value) for an outer `SELECT` to use. You nest when one layer has to **finish** before the next layer can start — typically "find the first year, **then** keep those rows".

Studio problems on this page: [Product Sales Analysis III](/problems/17-sql/product-sales-analysis-iii), [Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv), [Customer Who Visited but Did Not Make Any Transactions](/problems/17-sql/customer-who-visited-but-did-not-make-any-transactions).

## Four shapes (memorize the slots)

```sql
-- 1. IN / NOT IN   — outer row's value is in a *set* the inner query returns
WHERE product_id IN (SELECT product_id FROM …)

-- 2. Scalar         — inner query returns *one* value (one row, one column)
SELECT ROUND(x::numeric / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2)

-- 3. Derived table  — inner query is a *table* in FROM/JOIN
FROM Activity a
JOIN (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) f
  ON …

-- 4. EXISTS         — inner query returns *any* row (true/false), usually correlated
WHERE EXISTS (SELECT 1 FROM Transactions t WHERE t.visit_id = v.visit_id)
```

**Correlated** = the inner query mentions a column from the outer query (`t.visit_id = v.visit_id`). It conceptually runs **per outer row**. **Uncorrelated** = inner query stands alone; the engine can run it once.

## Example A — uncorrelated `IN` (first year, then detail)

[Product Sales Analysis III](/problems/17-sql/product-sales-analysis-iii): *for each product, all sales in the first year it was sold.*

You cannot `GROUP BY product_id` on the outer query — a product can have **two sales in its first year**, and both must come back.

**Layer 1 — the inner query, run it by itself:**

```sql
SELECT product_id, MIN(year) AS first_year
FROM Sales
GROUP BY product_id;
```

On the example data that is `(100, 2008)`, `(200, 2011)`. This is a **set of keys**.

**Layer 2 — keep detail rows whose `(product_id, year)` is in that set:**

```sql
SELECT
  product_id,
  year AS first_year,
  quantity,
  price
FROM Sales
WHERE (product_id, year) IN (
  SELECT product_id, MIN(year)
  FROM Sales
  GROUP BY product_id
);
```

Postgres allows **row-tuple `IN`**. The inner `SELECT` must have the same number of columns, in the same order.

Same idea as a join (see [Join vs nest](/reference/resources/sql/04-join-vs-nest)); nesting is natural when the inner result is "a set of keys I filter with".

### What not to write

```sql
-- WRONG: one row per product, even if the first year had two sales
SELECT DISTINCT ON (product_id) product_id, year AS first_year, quantity, price
FROM Sales
ORDER BY product_id, year;
```

## Example B — derived table + scalar subquery

[Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv): *fraction of players who logged in the day after their **first** login, 2 decimals.*

Break the English into two nested pieces:

1. Per player, the first login date.
2. Among those, who also has a row on `first + 1`.
3. Divide by **all** distinct players (a single number).

**Inner derived table — first login per player:**

```sql
SELECT player_id, MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;
```

Example: player 1 → 2016-03-01, player 2 → 2017-06-25, player 3 → 2016-03-02.

**Outer — keep activity on the next calendar day** (Postgres: `date + 1`):

```sql
SELECT a.player_id
FROM Activity a
JOIN (
  SELECT player_id, MIN(event_date) AS first_login
  FROM Activity
  GROUP BY player_id
) f
  ON a.player_id = f.player_id
 AND a.event_date = f.first_login + 1;
```

Only player 1 survives.

**Scalar subquery — the denominator is one number:**

```sql
SELECT ROUND(
  COUNT(DISTINCT a.player_id)::numeric
    / (SELECT COUNT(DISTINCT player_id) FROM Activity),
  2
) AS fraction
FROM Activity a
JOIN (
  SELECT player_id, MIN(event_date) AS first_login
  FROM Activity
  GROUP BY player_id
) f
  ON a.player_id = f.player_id
 AND a.event_date = f.first_login + 1;
```

`::numeric` is required — `1 / 3` in Postgres is `0` (integer division). The scalar subquery is uncorrelated: it does not mention `a`.

## Example C — correlated `EXISTS` / `NOT EXISTS`

[Customer Who Visited but Did Not Make Any Transactions](/problems/17-sql/customer-who-visited-but-did-not-make-any-transactions).

English: *visits for which **there does not exist** a transaction.* That sentence is `NOT EXISTS`.

**Inner query, correlated:** for a visit `v`, any transaction with that `visit_id`?

```sql
SELECT 1
FROM Transactions t
WHERE t.visit_id = v.visit_id   -- v comes from the outer query
```

**Outer:**

```sql
SELECT
  v.customer_id,
  COUNT(*) AS count_no_trans
FROM Visits v
WHERE NOT EXISTS (
  SELECT 1
  FROM Transactions t
  WHERE t.visit_id = v.visit_id
)
GROUP BY v.customer_id;
```

`SELECT 1` is conventional — `EXISTS` only cares whether **a row** came back, not the value.

Equivalent left-join form (often faster to type once you see it):

```sql
FROM Visits v
LEFT JOIN Transactions t ON t.visit_id = v.visit_id
WHERE t.transaction_id IS NULL
```

Prefer `NOT EXISTS` over `NOT IN (SELECT visit_id FROM Transactions)` — if `visit_id` is ever `NULL`, `NOT IN` makes the whole predicate unknown and you silently get **zero rows**.

## Nesting in `SELECT` (scalar per row)

You *can* write a correlated scalar in the select list:

```sql
SELECT
  u.id,
  u.name,
  (SELECT COALESCE(SUM(distance), 0) FROM Rides r WHERE r.user_id = u.id) AS travelled_distance
FROM Users u;
```

That is Top Travellers as "for each user, run a mini-query". It is legal and clear. A left join + `GROUP BY` is the same math; pick the shape you can explain in an interview. Do **not** nest a query that returns **two** columns in the select list — a scalar slot is one value.

## Rules of thumb

| Inner result | Slot |
|--------------|------|
| Set of keys | `WHERE col IN (SELECT …)` or tuple `IN` |
| One number | `(SELECT …)` in `SELECT` or arithmetic |
| A small table with extra columns | `JOIN (SELECT …) alias ON …` |
| Yes/no per outer row | `EXISTS` / `NOT EXISTS` |

If you catch yourself nesting three deep, name the layers with [`WITH`](/reference/resources/sql/03-ctes) instead.

## Practice

1. On Product Sales, write **only** the inner `MIN(year)` query and Run it mentally.
2. Wrap it in `WHERE (product_id, year) IN ( … )` and Submit.
3. Rewrite Game Play Analysis IV with a CTE (`WITH first_login AS (…)`). Same logic, new syntax — next note.
