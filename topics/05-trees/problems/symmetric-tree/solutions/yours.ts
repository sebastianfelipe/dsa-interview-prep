import { TreeNode } from '@lib/helpers';

function validateLeftAndRight(left: TreeNode | null, right: TreeNode | null): boolean {
  if (left === null && right === null) return true;
  if (left === null || right === null) return false;
  if (left.val !== right.val) return false;
  return (
    validateLeftAndRight(left.left, right.right) &&
    validateLeftAndRight(left.right, right.left)
  );
}

export function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true;
  return validateLeftAndRight(root.left, root.right);
}
