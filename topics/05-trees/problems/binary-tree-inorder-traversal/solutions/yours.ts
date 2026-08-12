import { TreeNode } from '@lib/helpers';

export function inorderTraversal(root: TreeNode | null, response: number[] = []): number[] {
  if (root === null) {
    return response;
  }

  if (!root.left && !root.right) {
    response.push(root.val);
    return response;
  }

  inorderTraversal(root.left, response);
  if (root.left != root.right) {
    response.push(root.val);
  }
  inorderTraversal(root.right, response);

  return response;
}
