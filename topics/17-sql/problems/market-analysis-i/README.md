# Market Analysis I

Table: `Users`

| Column         | Type    |
| -------------- | ------- |
| user_id        | int     |
| join_date      | date    |
| favorite_brand | varchar |

`user_id` is the primary key. Each row describes a user of an online shop where users can both
buy and sell items.

Table: `Orders`

| Column     | Type |
| ---------- | ---- |
| order_id   | int  |
| order_date | date |
| item_id    | int  |
| buyer_id   | int  |
| seller_id  | int  |

`order_id` is the primary key. `buyer_id` and `seller_id` reference `Users.user_id`.

Table: `Items`

| Column     | Type    |
| ---------- | ------- |
| item_id    | int     |
| item_brand | varchar |

`item_id` is the primary key.

Write a query to find, **for each user**, their join date and the number of orders they made
**as a buyer in 2019**.

Return the result table with columns `buyer_id, join_date, orders_in_2019`, in **any order**.

## Example

Input — `Users`:

| user_id | join_date  | favorite_brand |
| ------- | ---------- | -------------- |
| 1       | 2018-01-01 | Lenovo         |
| 2       | 2018-02-09 | Samsung        |
| 3       | 2018-01-19 | LG             |
| 4       | 2018-05-21 | HP             |

Input — `Orders`:

| order_id | order_date | item_id | buyer_id | seller_id |
| -------- | ---------- | ------- | -------- | --------- |
| 1        | 2019-08-01 | 4       | 1        | 2         |
| 2        | 2018-08-02 | 2       | 1        | 3         |
| 3        | 2019-08-03 | 3       | 2        | 3         |
| 4        | 2018-08-04 | 1       | 4        | 2         |
| 5        | 2018-08-04 | 1       | 3        | 4         |
| 6        | 2019-08-05 | 2       | 2        | 4         |

Output:

| buyer_id | join_date  | orders_in_2019 |
| -------- | ---------- | -------------- |
| 1        | 2018-01-01 | 1              |
| 2        | 2018-02-09 | 2              |
| 3        | 2018-01-19 | 0              |
| 4        | 2018-05-21 | 0              |

## Notes

- Every user must appear, even with zero 2019 purchases → `LEFT JOIN` from `Users`.
- The year filter belongs in the **join condition** (`ON … AND order_date BETWEEN …`), not in
  `WHERE` — a `WHERE` on the joined column silently turns the left join into an inner join and
  drops the zero-order users.
- `COUNT(o.order_id)` counts only matched rows; `COUNT(*)` would wrongly count 1 for users with
  no orders.
- The output column must be named `buyer_id` — alias `u.user_id AS buyer_id`.
