# Maximum Depth of Binary Tree

## Problem

Return max depth (root to farthest leaf).

## Recognition

DFS aggregate from children — or BFS counting levels.

## Code (TypeScript)

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## Key Extract

Base null → 0. Depth = 1 + max(children). Same shape as invert-tree / same-tree comparisons.
