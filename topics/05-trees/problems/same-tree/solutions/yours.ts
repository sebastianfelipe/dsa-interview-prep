import { TreeNode } from '@lib/helpers';

export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) {
    return true;
  }

  if (p?.val === q?.val) {
    return isSameTree(p!.left, q!.left) && isSameTree(p!.right, q!.right);
  }

  return false;
}
