# Pattern: BST Property

## Recognition

- Search / insert / delete in BST
- Validate BST
- Kth smallest (inorder)
- LCA in BST

## Rules

Inorder of BST is sorted. For node with value `v`, left subtree ∈ (-∞, v), right ∈ (v, ∞) — use **bounds**, not only local parent comparisons.

```ts
function isValidBST(
  node: TreeNode | null,
  low: number | null = null,
  high: number | null = null,
): boolean {
  if (!node) return true;
  if (low !== null && node.val <= low) return false;
  if (high !== null && node.val >= high) return false;
  return (
    isValidBST(node.left, low, node.val) &&
    isValidBST(node.right, node.val, high)
  );
}
```

## Key Extract

Validate/search with **ranges**. LCA: if both targets < node go left; both > go right; else node is LCA.
