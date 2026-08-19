# Rising Temperature

Table: `Weather`

| Column      | Type |
| ----------- | ---- |
| id          | int  |
| recordDate  | date |
| temperature | int  |

`id` is the primary key. Each row contains the temperature on a certain day. There are no two
rows with the same `recordDate`.

Write a query to find the IDs of all dates whose temperature is **higher than the previous
day's** (yesterday's).

Return the result table with a single column `id`, in **any order**.

## Example

Input — `Weather`:

| id  | recordDate | temperature |
| --- | ---------- | ----------- |
| 1   | 2015-01-01 | 10          |
| 2   | 2015-01-02 | 25          |
| 3   | 2015-01-03 | 20          |
| 4   | 2015-01-04 | 30          |

Output:

| id  |
| --- |
| 2   |
| 4   |

Explanation: Jan 2 (25) was warmer than Jan 1 (10), and Jan 4 (30) was warmer than Jan 3 (20).

## Notes

- Compare each row against **the row exactly one day earlier** — a **self-join** of `Weather`
  with itself on the date condition.
- In Postgres, `date + 1` adds one day, so the join is
  `w1.recordDate = w2.recordDate + 1` (MySQL folks would write `DATEDIFF(w1, w2) = 1`).
- Dates can have gaps — "previous row" is not the same as "previous day".
