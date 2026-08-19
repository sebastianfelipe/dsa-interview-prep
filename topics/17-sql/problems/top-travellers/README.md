# Top Travellers

Table: `Users`

| Column | Type    |
| ------ | ------- |
| id     | int     |
| name   | varchar |

`id` is the primary key.

Table: `Rides`

| Column   | Type |
| -------- | ---- |
| id       | int  |
| user_id  | int  |
| distance | int  |

`id` is the primary key. Each row records a ride by the user with `user_id` covering `distance` kilometers.

Write a query to report the distance travelled by each user. If a user has no rides, their
travelled distance is `0`.

Return the result table with columns `name, travelled_distance`, ordered by
`travelled_distance` **descending**; break ties by `name` **ascending**.

## Example

Input — `Users`:

| id  | name     |
| --- | -------- |
| 1   | Alice    |
| 2   | Bob      |
| 3   | Alex     |
| 4   | Donald   |
| 7   | Lee      |
| 13  | Jonathan |
| 19  | Elvis    |

Input — `Rides`:

| id  | user_id | distance |
| --- | ------- | -------- |
| 1   | 1       | 120      |
| 2   | 2       | 317      |
| 3   | 3       | 222      |
| 4   | 7       | 100      |
| 5   | 13      | 312      |
| 6   | 19      | 50       |
| 7   | 7       | 120      |
| 8   | 19      | 400      |
| 9   | 7       | 230      |

Output:

| name     | travelled_distance |
| -------- | ------------------ |
| Elvis    | 450                |
| Lee      | 450                |
| Bob      | 317                |
| Jonathan | 312                |
| Alex     | 222                |
| Alice    | 120                |
| Donald   | 0                  |

Explanation: Elvis and Lee both travelled 450 km; Elvis comes first alphabetically. Donald has
no rides, so his distance is 0.

## Notes

- Users with no rides must still appear — that's a `LEFT JOIN` from `Users` to `Rides`.
- `SUM(distance)` is `NULL` for users with no rides; wrap it with `COALESCE(…, 0)`.
- Order matters here: `ORDER BY travelled_distance DESC, name ASC`.
