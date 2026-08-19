# Pattern: CASE WHEN

## Recognition

- Output a **computed column** whose value depends on a condition
- "If X then salary else 0", "bonus / no bonus", "label this row"
- No extra table to join — it's projection, not a relationship

## Idea

Use `CASE WHEN … THEN … ELSE … END` in the `SELECT` list (or inside an aggregate). Conditions are checked top to bottom; the first match wins.

```sql
SELECT
  employee_id,
  CASE
    WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary
    ELSE 0
  END AS bonus
FROM Employees
ORDER BY employee_id;
```

## Pitfalls

- Alias the result with the **exact** output name the problem asks for (`AS bonus`).
- `LIKE 'M%'` is case-sensitive in Postgres unless you use `ILIKE`.
- `%` is modulo on integers; `LIKE` is pattern matching — they are not interchangeable.

## Studio

- [Calculate Special Bonus](/problems/17-sql/calculate-special-bonus)

## Key Extract

**`CASE` is an expression**, not a statement. It belongs in `SELECT` (or `ORDER BY`), and always needs an `ELSE` when "otherwise 0 / NULL / 'other'" is part of the spec.
