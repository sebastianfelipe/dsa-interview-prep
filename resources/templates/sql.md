# SQL query skeletons (Postgres)

Paste into the studio console, then fill the blanks. Dialect is PostgreSQL.

## Conditional column

```sql
SELECT
  id,
  CASE
    WHEN /* cond */ THEN /* value */
    ELSE 0
  END AS /* output_name */
FROM /* table */
ORDER BY id;
```

## Keep unmatched (zeros)

```sql
SELECT
  l.id,
  COALESCE(AGG(r.col), 0) AS total
FROM left_table l
LEFT JOIN right_table r
  ON r.fk = l.id
 -- AND r.event_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
GROUP BY l.id;
```

## Anti-join

```sql
SELECT l.id
FROM left_table l
LEFT JOIN right_table r ON r.fk = l.id
WHERE r.pk IS NULL;
```

## Group filter

```sql
SELECT grp
FROM t
GROUP BY grp
HAVING COUNT(*) >= 5;
```

## Yesterday (self-join)

```sql
SELECT today.id
FROM t today
JOIN t yesterday ON today.dt = yesterday.dt + 1
WHERE today.val > yesterday.val;
```

## First event, then detail

```sql
SELECT s.*
FROM sales s
WHERE (s.product_id, s.year) IN (
  SELECT product_id, MIN(year)
  FROM sales
  GROUP BY product_id
);
```

## Dense rank

```sql
SELECT
  score,
  DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM scores
ORDER BY score DESC;
```

## Moving 7 calendar days

```sql
SUM(amount) OVER (
  ORDER BY visited_on
  RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
)
```
