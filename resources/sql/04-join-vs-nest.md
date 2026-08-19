# Join vs nest

Most "nested query" problems have a **join spelling** and a **nest spelling**. Interviewers care that you can switch. This page puts both next to each other on the same data.

## 1. First-event keys — nest `IN` vs join

[Product Sales Analysis III](/problems/17-sql/product-sales-analysis-iii)

**Nest (set of keys):**

```sql
SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (
  SELECT product_id, MIN(year)
  FROM Sales
  GROUP BY product_id
);
```

**Join (keys as a table):**

```sql
SELECT s.product_id, s.year AS first_year, s.quantity, s.price
FROM Sales s
JOIN (
  SELECT product_id, MIN(year) AS first_year
  FROM Sales
  GROUP BY product_id
) f
  ON s.product_id = f.product_id
 AND s.year = f.first_year;
```

Same result. Use `IN` when the inner query is only keys. Use `JOIN` when you want to **see** `first_year` as a column in the inner table (debugging) or attach more inner columns.

## 2. Anti-join — `NOT EXISTS` vs `LEFT JOIN … IS NULL`

[Customer Who Visited but Did Not Make Any Transactions](/problems/17-sql/customer-who-visited-but-did-not-make-any-transactions)

**Nest (English: there does not exist a transaction):**

```sql
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
WHERE NOT EXISTS (
  SELECT 1 FROM Transactions t WHERE t.visit_id = v.visit_id
)
GROUP BY v.customer_id;
```

**Join (English: the transaction side came back empty):**

```sql
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t ON t.visit_id = v.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;
```

Pick `NOT EXISTS` if you are talking in "exists" language. Pick the left join if you already have the join drawn on the whiteboard. Avoid `NOT IN` when the inner column can be `NULL`.

## 3. Per-row aggregate — scalar subquery vs left join

[Top Travellers](/problems/17-sql/top-travellers)

**Nest (one mini-sum per user):**

```sql
SELECT
  u.name,
  (SELECT COALESCE(SUM(r.distance), 0)
   FROM Rides r
   WHERE r.user_id = u.id) AS travelled_distance
FROM Users u
ORDER BY travelled_distance DESC, u.name;
```

**Join:**

```sql
SELECT
  u.name,
  COALESCE(SUM(r.distance), 0) AS travelled_distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id
GROUP BY u.id, u.name
ORDER BY travelled_distance DESC, u.name;
```

The scalar version does not need `GROUP BY` on `Users` — each outer row is already one user. The join version must group because the join **duplicates** users with many rides.

## How to choose in 15 seconds

```text
Inner result is a set of keys
  └─ IN (…), or JOIN that subquery

Inner result is yes/no
  └─ EXISTS / NOT EXISTS, or LEFT JOIN + IS NULL

Inner result is one number per outer row
  └─ scalar subquery in SELECT, or JOIN + GROUP BY

Inner result is reused twice, or two deep
  └─ WITH (CTE), then join it
```

## Drill

Take any passing query on this list and **flip the shape** (join ↔ nest) without changing the result. Submit both. If one fails, the bug is almost always: missing `COALESCE`, `COUNT(*)` vs `COUNT(pk)`, or a filter in `WHERE` that belongs in `ON`.
