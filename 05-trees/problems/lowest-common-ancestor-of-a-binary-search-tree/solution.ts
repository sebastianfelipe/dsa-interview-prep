import { TreeNode } from '@lib/helpers';

export function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node; // split or equal → LCA
  }
  return null;
}
