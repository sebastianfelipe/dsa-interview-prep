import { TreeNode } from '@lib/helpers';
function isMirror(a: TreeNode | null, b: TreeNode | null): boolean {
  if (!a && !b) {
    return true;
  }
  if (!a || !b || a.val !== b.val) {
    return false;
  }
  return isMirror(a.left, b.right) && isMirror(a.right, b.left);
}
export function isSymmetric(root: TreeNode | null): boolean {
  if (!root) {
    return true;
  }
  return isMirror(root.left, root.right);
}
