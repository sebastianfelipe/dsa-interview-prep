# Validate Binary Search Tree

## Problem

Determine if a tree is a valid BST.

## Recognition

BST bounds / inorder strictly increasing — **not** only `left < node < right` locally (fails on deeper violations).

## Code (TypeScript)

```ts
function isValidBST(root: TreeNode | null): boolean {
  const dfs = (
    node: TreeNode | null,
    low: number | null,
    high: number | null,
  ): boolean => {
    if (!node) return true;
    if (low !== null && node.val <= low) return false;
    if (high !== null && node.val >= high) return false;
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  };
  return dfs(root, null, null);
}
```

## Pitfalls

- Using `<=` vs `<` incorrectly with duplicates (problem usually forbids dups)
- Number.MIN_SAFE_INTEGER tricks — prefer `null` bounds

## Key Extract

Pass **allowed (low, high)** range down. Classic trap problem — mention the counterexample of `[5,4,6,null,null,3,7]` in interviews.
