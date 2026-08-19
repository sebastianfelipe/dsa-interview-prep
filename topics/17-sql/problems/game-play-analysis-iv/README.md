# Game Play Analysis IV

Table: `Activity`

| Column       | Type |
| ------------ | ---- |
| player_id    | int  |
| device_id    | int  |
| event_date   | date |
| games_played | int  |

`(player_id, event_date)` is the primary key. Each row records a player logging in and playing
some games (possibly 0) on one day, on some device.

Write a query to report the **fraction of players that logged in again on the day after their
first login**, rounded to **2 decimal places**.

In other words: count the players who logged in on the day right after their first login day,
and divide by the total number of distinct players.

Return the result table with a single column `fraction`.

## Example

Input — `Activity`:

| player_id | device_id | event_date | games_played |
| --------- | --------- | ---------- | ------------ |
| 1         | 2         | 2016-03-01 | 5            |
| 1         | 2         | 2016-03-02 | 6            |
| 2         | 3         | 2017-06-25 | 1            |
| 3         | 1         | 2016-03-02 | 0            |
| 3         | 4         | 2018-07-03 | 5            |

Output:

| fraction |
| -------- |
| 0.33     |

Explanation: only player 1 logged back in the day after their first login (2016-03-01 →
2016-03-02). 1 of 3 players → `1 / 3 = 0.33`.

## Notes

- First find each player's **first login date**: `MIN(event_date) GROUP BY player_id`.
- Then check for a row on `first_login + 1` — in Postgres, `date + 1` adds one day.
- Watch out for integer division: `COUNT(...)::numeric / total` before `ROUND(…, 2)`.
- Consecutive days later in a player's history do **not** count — only the day right after the
  first login.
