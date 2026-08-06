# Trees

Binary trees and BSTs. Almost every problem is DFS (path/aggregate) or BFS (levels).

## Patterns

| Pattern | File |
|---------|------|
| DFS recursion | [patterns/dfs.md](./patterns/dfs.md) |
| BFS level order | [patterns/bfs-level-order.md](./patterns/bfs-level-order.md) |
| BST property | [patterns/bst.md](./patterns/bst.md) |

## Worked problems

| Problem | File |
|---------|------|
| Maximum Depth | [problems/maximum-depth.md](./problems/maximum-depth.md) |
| Binary Tree Level Order | [problems/level-order.md](./problems/level-order.md) |
| Validate BST | [problems/validate-bst.md](./problems/validate-bst.md) |
| Lowest Common Ancestor (BST) | [problems/lca-bst.md](./problems/lca-bst.md) |

## TypeScript node

```ts
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

## Key Extract

Ask: do I need **levels** (BFS) or **path/subtree values** (DFS)? For BST, use ordered property before generic tree algorithms.
