# SQL — how to build queries

These notes are **worked constructions**, not a syntax list. Read them with a problem open in the studio, and type each layer before you look at the next.

| Note | What you practice |
|------|-------------------|
| [Build a query in layers](/reference/resources/sql/01-building-queries) | From English → `FROM` → join → filter → group → `SELECT` |
| [Nested queries](/reference/resources/sql/02-nested-queries) | `IN`, scalar subqueries, `FROM (SELECT …)`, `EXISTS` |
| [CTEs (`WITH`)](/reference/resources/sql/03-ctes) | Name each layer so nesting stays readable |
| [Join vs nest](/reference/resources/sql/04-join-vs-nest) | Same result, two shapes — when to pick which |

Patterns (recognition only) still live under [SQL & Databases — Patterns](/reference/topics/17-sql/patterns/case-when). The [cheat sheet](/reference/resources/cheat-sheets/sql-postgres) is the one-page reminder after you can already assemble a query.

## How to use this

1. Cover the next SQL block with your hand.
2. Write the layer in the studio console and **Run**.
3. Only then compare to the snippet.

If Run fails, use **Help with my code** — the coach is wired to talk about clauses, not algorithms.
