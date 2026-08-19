# Product Sales Analysis III

Table: `Sales`

| Column     | Type |
| ---------- | ---- |
| sale_id    | int  |
| product_id | int  |
| year       | int  |
| quantity   | int  |
| price      | int  |

`(sale_id, year)` is the primary key. Each row records a sale of product `product_id` in
`year`, with the quantity sold and the **price per unit**.

Write a query to select, for each product, **all sales made in the first year the product was
sold** — reporting the product id, that year, the quantity, and the price.

Return the result table with columns `product_id, first_year, quantity, price`, in
**any order**.

## Example

Input — `Sales`:

| sale_id | product_id | year | quantity | price |
| ------- | ---------- | ---- | -------- | ----- |
| 1       | 100        | 2008 | 10       | 5000  |
| 2       | 100        | 2009 | 12       | 5000  |
| 7       | 200        | 2011 | 15       | 9000  |

Output:

| product_id | first_year | quantity | price |
| ---------- | ---------- | -------- | ----- |
| 100        | 2008       | 10       | 5000  |
| 200        | 2011       | 15       | 9000  |

Explanation: product 100 was first sold in 2008, so its 2009 sale is excluded. Product 200's
only sale is its first.

## Notes

- Find each product's first year with `MIN(year) … GROUP BY product_id`, then keep the sales
  rows matching that `(product_id, year)` pair — Postgres supports **row-tuple `IN`**:
  `WHERE (product_id, year) IN (SELECT …)`.
- A product can have **several sales in its first year** — all of them must be returned, which
  is why a plain `GROUP BY product_id` with aggregates doesn't work.
- Alias the year column as `first_year`.
