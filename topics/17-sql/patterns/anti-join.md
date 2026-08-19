# Pattern: Anti-Join

## Recognition

- "Visited but **did not** transact", "customers with **no** orders", "rows in A missing from B"
- You need the **absence** of a match, not a count of matches

## Idea

`LEFT JOIN` the events, keep rows where the right-hand primary key **is NULL**, then aggregate if the problem asks "how many such visits".

```sql
SELECT
  v.customer_id,
  COUNT(*) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t ON t.visit_id = v.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;
```

`NOT EXISTS` is the same idea and often reads cleaner:

```sql
WHERE NOT EXISTS (
  SELECT 1 FROM Transactions t WHERE t.visit_id = v.visit_id
)
```

## Pitfalls

- `NOT IN (SELECT visit_id FROM Transactions)` is wrong if that column can be `NULL` (the whole predicate becomes unknown). Prefer `NOT EXISTS` / `IS NULL`.
- Filter `IS NULL` **after** the left join; putting it in `ON` would not drop matched rows.

## Studio

- [Customer Who Visited but Did Not Make Any Transactions](/problems/17-sql/customer-who-visited-but-did-not-make-any-transactions)

## Key Extract

**Anti-join = left join + `right.pk IS NULL` (or `NOT EXISTS`).** You are selecting the holes.
