# Classes With at Least 5 Students

Table: `Courses`

| Column  | Type    |
| ------- | ------- |
| student | varchar |
| class   | varchar |

`(student, class)` is the primary key. Each row indicates the name of a student and the class
they are enrolled in.

Write a query to find all classes that have **at least five students**.

Return the result table with a single column `class`, in **any order**.

## Example

Input — `Courses`:

| student | class    |
| ------- | -------- |
| A       | Math     |
| B       | English  |
| C       | Math     |
| D       | Biology  |
| E       | Math     |
| F       | Computer |
| G       | Math     |
| H       | Math     |
| I       | Math     |

Output:

| class |
| ----- |
| Math  |

Explanation: Math has 6 students; every other class has fewer than 5.

## Notes

- Filtering on an **aggregate** is what `HAVING` is for — `WHERE COUNT(...)` is invalid because
  `WHERE` runs before grouping.
- The primary key guarantees no duplicate `(student, class)` pairs, so a plain `COUNT(student)`
  is enough (no `DISTINCT` needed).
