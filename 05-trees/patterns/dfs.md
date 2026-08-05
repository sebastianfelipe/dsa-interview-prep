# Pattern: Tree DFS

## Recognition

- Depth, diameter, path sum, invert, serialize
- Compute value from left/right children
- Root-to-leaf decisions

## Templates

**Return aggregate:**

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**Bubble info up (diameter style):** helper returns height; updates global/best with `leftH + rightH`.

**Pass info down:** `dfs(node, currentSum)` for path sums.

## Key Extract

Define what each call **returns** and what it **receives**. That contract is the solution.
