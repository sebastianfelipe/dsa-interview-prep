import { TreeNode } from '@lib/helpers';

export function levelOrder(root: TreeNode | null): number[][] {
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
