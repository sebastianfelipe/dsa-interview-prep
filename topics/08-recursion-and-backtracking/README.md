# Recursion & Backtracking

Explore decision trees: choose → recurse → undo.

## Patterns

| Pattern | File |
|---------|------|
| Subsets / combinations | [patterns/subsets-combinations.md](./patterns/subsets-combinations.md) |
| Permutations | [patterns/permutations.md](./patterns/permutations.md) |
| Pruning / constraint | [patterns/pruning.md](./patterns/pruning.md) |

## Worked problems

| Problem | File |
|---------|------|
| Subsets | [problems/subsets.md](./problems/subsets.md) |
| Combination Sum | [problems/combination-sum.md](./problems/combination-sum.md) |
| Permutations | [problems/permutations.md](./problems/permutations.md) |
| Word Search | [problems/word-search.md](./problems/word-search.md) |

## Skeleton

```ts
function dfs(start: number): void {
  // record / check complete
  for (let i = start; i < n; i++) {
    // prune?
    choose(i);
    dfs(nextStart);
    undo(i);
  }
}
```

## Key Extract

Backtracking = DFS on the solution space with undo. Identify the **choice list** and **constraints**.
