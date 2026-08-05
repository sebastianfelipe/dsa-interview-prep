# Pattern: BFS Level Order

## Recognition

- Level order traversal
- Right side view / zigzag
- Min depth (BFS finds shallowest leaf first)
- Connect next pointers

## Template

```ts
const queue: TreeNode[] = [root];
let head = 0;
while (head < queue.length) {
  const size = queue.length - head; // current level width
  for (let i = 0; i < size; i++) {
    const node = queue[head++]!;
    // visit node
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
```

## Key Extract

Capture `size` before the inner loop — that freezes the current level. Prefer head-index queue over `shift()`.
