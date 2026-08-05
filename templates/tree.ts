export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** DFS recursive — return aggregated value from children. */
export function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/** BFS level order. */
export function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

/**
 * Note: Array.shift() is O(n). In interviews, mention you'd use an index
 * pointer or a real queue for O(1) dequeue if performance mattered.
 */
export function levelOrderEfficient(root: TreeNode | null): number[][] {
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
