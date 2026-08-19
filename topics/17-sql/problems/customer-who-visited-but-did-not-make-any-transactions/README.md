# Customer Who Visited but Did Not Make Any Transactions

Table: `Visits`

| Column      | Type |
| ----------- | ---- |
| visit_id    | int  |
| customer_id | int  |

`visit_id` is the primary key. Each row is one visit by a customer to the mall.

Table: `Transactions`

| Column         | Type |
| -------------- | ---- |
| transaction_id | int  |
| visit_id       | int  |
| amount         | int  |

`transaction_id` is the primary key. Each row is a transaction made during the visit
`visit_id`.

Write a query to find the IDs of customers who visited **without making any transaction**, and
**how many such visits** each of them made.

Return the result table with columns `customer_id, count_no_trans`, in **any order**.

## Example

Input — `Visits`:

| visit_id | customer_id |
| -------- | ----------- |
| 1        | 23          |
| 2        | 9           |
| 4        | 30          |
| 5        | 54          |
| 6        | 96          |
| 7        | 54          |
| 8        | 54          |

Input — `Transactions`:

| transaction_id | visit_id | amount |
| -------------- | -------- | ------ |
| 2              | 5        | 310    |
| 3              | 5        | 300    |
| 9              | 5        | 200    |
| 12             | 1        | 910    |
| 13             | 2        | 970    |

Output:

| customer_id | count_no_trans |
| ----------- | -------------- |
| 54          | 2              |
| 30          | 1              |
| 96          | 1              |

Explanation: customer 54 visited 3 times but transacted only on visit 5 → 2 empty-handed
visits. Customers 30 and 96 each visited once with no transaction. Customers 23 and 9
transacted on their only visits, so they don't appear.

## Notes

- This is a classic **anti-join**: `LEFT JOIN Transactions` then keep rows where the joined
  side `IS NULL`.
- Group the remaining visits by `customer_id` and count them.
- `NOT IN (SELECT visit_id FROM Transactions)` also works here.
