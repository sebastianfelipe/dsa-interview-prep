# Pattern: LEFT JOIN Keep Unmatched

## Recognition

- "For **each** user / product / day, report a count — even if it is 0"
- The left table is the universe of rows that must appear
- The right table is optional events (rides, orders, clicks)

## Idea

Start from the table that must survive. Put extra filters on the **join condition**, not in `WHERE` — a `WHERE` on the right-hand column turns the left join into an inner join.

```sql
SELECT
  u.name,
  COALESCE(SUM(r.distance), 0) AS travelled_distance
FROM Users u
LEFT JOIN Rides r ON r.user_id = u.id
GROUP BY u.id, u.name
ORDER BY travelled_distance DESC, u.name;
```

Year / date filters belong in `ON`:

```sql
FROM Users u
LEFT JOIN Orders o
  ON o.buyer_id = u.user_id
 AND o.order_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
```

## Pitfalls

- `SUM(x)` / `COUNT(x)` over no matches is `NULL` / `0` respectively — wrap `SUM` in `COALESCE(…, 0)`.
- `COUNT(*)` after a left join still counts the leftover left row (as 1). Use `COUNT(right.pk)` so unmatched rows contribute 0.
- Group by the left table's **primary key** (not only `name`) so duplicate names stay separate.

## Studio

- [Top Travellers](/problems/17-sql/top-travellers)
- [Market Analysis I](/problems/17-sql/market-analysis-i)

## Key Extract

**Left table = who must appear. Filters on the optional table go in `ON`, not `WHERE`.**
