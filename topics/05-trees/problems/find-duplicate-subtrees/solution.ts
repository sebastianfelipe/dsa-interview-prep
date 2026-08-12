import { TreeNode } from '@lib/helpers';
export function findDuplicateSubtrees(root: TreeNode | null): Array<TreeNode | null> {
  const count = new Map<string, number>();
  const result: TreeNode[] = [];
  function serialize(node: TreeNode | null): string {
    if (!node) {
      return '#';
    }
    const key = `${node.val},${serialize(node.left)},${serialize(node.right)}`;
    const seen = (count.get(key) ?? 0) + 1;
    count.set(key, seen);
    if (seen === 2) {
      result.push(node);
    }
    return key;
  }
  serialize(root);
  return result;
}
