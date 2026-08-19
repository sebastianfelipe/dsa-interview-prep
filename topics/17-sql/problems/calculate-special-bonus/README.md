# Calculate Special Bonus

Table: `Employees`

| Column      | Type    |
| ----------- | ------- |
| employee_id | int     |
| name        | varchar |
| salary      | int     |

`employee_id` is the primary key. Each row contains an employee's id, name, and salary.

Write a query to calculate the **bonus** of each employee:

- The bonus is **100% of their salary** if the `employee_id` is **odd** and the name does
  **not start with the character `'M'`**.
- Otherwise the bonus is **0**.

Return the result table with columns `employee_id, bonus`, ordered by `employee_id`.

## Example

Input — `Employees`:

| employee_id | name    | salary |
| ----------- | ------- | ------ |
| 2           | Meir    | 3000   |
| 3           | Michael | 3800   |
| 7           | Addilyn | 7400   |
| 8           | Juan    | 6100   |
| 9           | Kannon  | 7700   |

Output:

| employee_id | bonus |
| ----------- | ----- |
| 2           | 0     |
| 3           | 0     |
| 7           | 7400  |
| 8           | 0     |
| 9           | 7700  |

Explanation:

- Employees 2 and 8 have even ids → bonus 0.
- Employee 3 has an odd id, but the name starts with `'M'` → bonus 0.
- Employees 7 and 9 have odd ids and names not starting with `'M'` → full salary as bonus.

## Notes

- One `SELECT` with a `CASE WHEN` covers both conditions — no join needed.
- `employee_id % 2 = 1` tests oddness; `name NOT LIKE 'M%'` tests the first character.
- Don't forget the `ORDER BY employee_id` — row order is checked for this problem.
