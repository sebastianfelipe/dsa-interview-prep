# Combination Sum

## Problem

Find all unique combinations in `candidates` that sum to `target`. Unlimited reuse of each number.

## Recognition

Combinations with reuse → backtracking with same index on recurse.

## Code (TypeScript)

```ts
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (start: number, remain: number): void => {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i]!;
      if (c > remain) continue; // prune (better if sorted)
      path.push(c);
      dfs(i, remain - c); // i not i+1 → reuse allowed
      path.pop();
    }
  };

  candidates.sort((a, b) => a - b);
  dfs(0, target);
  return result;
}
```

## Key Extract

Reuse → recurse `i`; no reuse → `i+1`. Prune when candidate > remain. Sort enables early break.
