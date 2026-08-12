import { TreeNode } from '@lib/helpers';

export class BSTIterator {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode | null) {
    this.pushLeft(root);
  }

  next(): number {
    const node = this.stack.pop();
    if (!node) throw new Error('BSTIterator has no next node');
    this.pushLeft(node.right);
    return node.val;
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }

  private pushLeft(node: TreeNode | null) {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }
}
