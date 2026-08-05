# Lowest Common Ancestor of a BST

## Problem

Find LCA of nodes `p` and `q` in a BST.

## Recognition

BST ordering → walk down without full tree search.

## Code (TypeScript)

```ts
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node; // split or equal → LCA
  }
  return null;
}
```

## Key Extract

If both targets on one side, go there; else current node is LCA. For **binary tree** (not BST), use DFS returning found flags / nodes.
