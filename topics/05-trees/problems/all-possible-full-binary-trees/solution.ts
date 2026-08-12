import { TreeNode } from '@lib/helpers';
export function allPossibleFBT(n: number): Array<TreeNode | null> {
  const memo = new Map<number, Array<TreeNode | null>>();
  function build(nodes: number): Array<TreeNode | null> {
    if (nodes % 2 === 0) {
      return [];
    }
    if (nodes === 1) {
      return [new TreeNode(0)];
    }
    const cached = memo.get(nodes);
    if (cached) {
      return cached;
    }
    const result: Array<TreeNode | null> = [];
    for (let left = 1; left < nodes; left += 2) {
      const right = nodes - 1 - left;
      for (const l of build(left)) {
        for (const r of build(right)) {
          result.push(new TreeNode(0, l, r));
        }
      }
    }
    memo.set(nodes, result);
    return result;
  }
  return build(n);
}
