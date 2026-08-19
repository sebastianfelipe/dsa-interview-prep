# Pattern: First Event per Group

## Recognition

- "Sales in the **first year** the product was sold"
- "Logged in the day after their **first** login"
- You need the **min / max / earliest** key per group, then the **original rows** that match it

## Idea

Aggregate to find the first key, then join (or `IN` on a row tuple) back to the detail table. Do **not** `GROUP BY` the detail if multiple rows share that first key — they all count.

```sql
SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (
  SELECT product_id, MIN(year)
  FROM Sales
  GROUP BY product_id
);
```

Same idea with a join:

```sql
FROM Activity a
JOIN (
  SELECT player_id, MIN(event_date) AS first_login
  FROM Activity
  GROUP BY player_id
) f ON a.player_id = f.player_id
   AND a.event_date = f.first_login + 1
```

## Pitfalls

- `SELECT DISTINCT ON (product_id) … ORDER BY year` returns **one** row per product — wrong if the first year has several sales.
- Integer division: `COUNT(*)::numeric / total` before `ROUND(…, 2)`.
- "First" is `MIN(event_date)`, not the first row you happen to read.

## Studio

- [Product Sales Analysis III](/problems/17-sql/product-sales-analysis-iii)
- [Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv)

## Key Extract

**Find the first key per group, then keep every detail row that matches that key.** Aggregation finds the key; a second step recovers the rows.
