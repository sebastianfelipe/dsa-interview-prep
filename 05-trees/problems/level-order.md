# Binary Tree Level Order Traversal

## Problem

Return values level by level as `number[][]`.

## Recognition

**BFS** with level sizing.

## Code (TypeScript)

```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  let head = 0;

  while (head < queue.length) {
    const size = queue.length - head;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++]!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

## Key Extract

Freeze level `size`. Variants: zigzag (alternate reverse), right side view (`level[level.length-1]`).
