# Subsets

## Problem

Return all subsets of `nums` (unique elements).

## Recognition

Classic backtracking / start-index DFS.

## Code (TypeScript)

```ts
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (start: number): void => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]!);
      dfs(i + 1);
      path.pop();
    }
  };

  dfs(0);
  return result;
}
```

## Key Extract

Record path at every node (not only leaves). Choose then undo. O(n·2ⁿ) outputs.
