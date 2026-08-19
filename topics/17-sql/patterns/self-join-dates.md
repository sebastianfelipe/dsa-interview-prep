# Pattern: Self-Join on Dates

## Recognition

- Compare a row to **another row of the same table**
- "Higher temperature than **yesterday**", "logged in the **next day**", "consecutive dates"
- "Previous row" in result order is **not** the same as "previous calendar day"

## Idea

Alias the table twice. Join on the date arithmetic, then compare the payload.

```sql
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = w2.recordDate + 1
WHERE w1.temperature > w2.temperature;
```

In Postgres, `date + 1` adds one day. (MySQL: `DATEDIFF(w1.recordDate, w2.recordDate) = 1`.)

## Pitfalls

- Gaps in dates: 1 Jan then 3 Jan is **not** "yesterday". Join on `date + 1`, not on `id - 1`.
- Month/year boundaries work automatically with date types — don't roll your own day numbers.
- For "the day after **first** login" you usually combine this with a `MIN(date)` subquery, not a full self-join of every consecutive pair.

## Studio

- [Rising Temperature](/problems/17-sql/rising-temperature)
- [Game Play Analysis IV](/problems/17-sql/game-play-analysis-iv) (first-login + next day)

## Key Extract

**Self-join on `date + 1`, never on adjacent ids.** Calendar adjacency ≠ sort adjacency.
