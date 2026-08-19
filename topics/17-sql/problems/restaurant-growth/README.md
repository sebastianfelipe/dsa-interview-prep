# Restaurant Growth

Table: `Customer`

| Column      | Type    |
| ----------- | ------- |
| customer_id | int     |
| name        | varchar |
| visited_on  | date    |
| amount      | int     |

`(customer_id, visited_on)` is the primary key. Each row says that customer `customer_id`
visited on `visited_on` and paid `amount`.

You own a restaurant and want to analyze a possible expansion — you need the **moving average
of daily revenue over a 7-day window** (current day + the 6 days before it).

Write a query to compute, for each qualifying day:

- `amount` — total revenue paid over that 7-day window, and
- `average_amount` — that total divided by 7, rounded to **2 decimal places**.

Only include days that have **at least 6 days of history before them** (i.e. starting from the
7th day of business). Return columns `visited_on, amount, average_amount`, ordered by
`visited_on`.

## Example

Input — `Customer`:

| customer_id | name    | visited_on | amount |
| ----------- | ------- | ---------- | ------ |
| 1           | Jhon    | 2019-01-01 | 100    |
| 2           | Daniel  | 2019-01-02 | 110    |
| 3           | Jade    | 2019-01-03 | 120    |
| 4           | Khaled  | 2019-01-04 | 130    |
| 5           | Winston | 2019-01-05 | 110    |
| 6           | Elvis   | 2019-01-06 | 140    |
| 7           | Anna    | 2019-01-07 | 150    |
| 8           | Maria   | 2019-01-08 | 80     |
| 9           | Jaze    | 2019-01-09 | 110    |
| 1           | Jhon    | 2019-01-10 | 130    |
| 3           | Jade    | 2019-01-10 | 150    |

Output:

| visited_on | amount | average_amount |
| ---------- | ------ | -------------- |
| 2019-01-07 | 860    | 122.86         |
| 2019-01-08 | 840    | 120.00         |
| 2019-01-09 | 840    | 120.00         |
| 2019-01-10 | 1000   | 142.86         |

Explanation: the first window is Jan 1–7 (100+110+120+130+110+140+150 = 860, avg 122.86). Note
Jan 10 has two visits that sum to 280.

## Notes

- Two layers: first collapse to **daily revenue** (`GROUP BY visited_on` — several customers
  can visit the same day), then compute the window.
- A date-based window frame
  (`RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW`) is safer than
  `ROWS BETWEEN 6 PRECEDING` because it stays correct if some days have no visits.
- The average divides by exactly 7 (`/ 7.0` to avoid integer division), then `ROUND(…, 2)`.
- Filter to days on or after `MIN(visited_on) + 6`, and order by `visited_on`.
