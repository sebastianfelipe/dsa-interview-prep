import { describe, it, expect } from 'vitest';
import { TreeNode, treeFromArray } from '@lib/helpers';
import { findDuplicateSubtrees } from './solution';

function serializeTree(node: TreeNode | null): string {
  if (!node) return '#';
  return `${node.val},${serializeTree(node.left)},${serializeTree(node.right)}`;
}

describe('Find Duplicate Subtrees', () => {
  it('example 1', () => {
    const root = treeFromArray([1, 2, 3, 4, null, 2, 4, null, null, 4]);
    const dups = findDuplicateSubtrees(root);
    const shapes = dups.map(serializeTree).sort();
    expect(shapes).toEqual(['2,4,#,#,#', '4,#,#'].sort());
  });
  it('example 2', () => {
    expect(findDuplicateSubtrees(treeFromArray([2, 1, 1])).map((n) => n!.val)).toEqual([1]);
  });
  it('example 3', () => {
    const root = treeFromArray([2, 2, 2, 3, null, 3, null]);
    const shapes = findDuplicateSubtrees(root).map(serializeTree).sort();
    expect(shapes).toEqual(['2,3,#,#,#', '3,#,#'].sort());
  });
});
