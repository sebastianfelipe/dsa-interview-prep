import { TreeNode } from '@lib/helpers';
export function isValidBST(root: TreeNode | null): boolean {
  const dfs = (node: TreeNode | null, low: number | null, high: number | null): boolean => {
    if (!node) {
      return true;
    }
    if (low !== null && node.val <= low) {
      return false;
    }
    if (high !== null && node.val >= high) {
      return false;
    }
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  };
  return dfs(root, null, null);
}
