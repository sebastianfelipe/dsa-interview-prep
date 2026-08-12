import { TreeNode } from '@lib/helpers';

function validateLeftAndRight(left: TreeNode | null, right: TreeNode | null): boolean {
  if (left === null && right === null) {
    return true;
  }

  if (left?.val === right?.val) {
    return (
      validateLeftAndRight(left!.left, right!.right) &&
      validateLeftAndRight(left!.right, right!.left)
    );
  }

  return false;
}

export function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true;
  if (root.left?.val !== root.right?.val) {
    return false;
  }

  return validateLeftAndRight(root.left, root.right);
}
