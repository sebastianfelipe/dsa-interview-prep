import { describe, it, expect } from 'vitest';
import { TreeNode, treeToArray } from '@lib/helpers';
import { allPossibleFBT } from './solution';

function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function isFull(node: TreeNode | null): boolean {
  if (!node) return true;
  if (!node.left && !node.right) return true;
  if (node.left && node.right) return isFull(node.left) && isFull(node.right);
  return false;
}

describe('All Possible Full Binary Trees', () => {
  it('example 1', () => {
    const trees = allPossibleFBT(7);
    expect(trees).toHaveLength(5);
    for (const t of trees) {
      expect(countNodes(t)).toBe(7);
      expect(isFull(t)).toBe(true);
    }
  });
  it('example 2', () => {
    const trees = allPossibleFBT(3);
    expect(trees).toHaveLength(1);
    expect(treeToArray(trees[0]!)).toEqual([0, 0, 0]);
  });
  it('even n yields empty', () => {
    expect(allPossibleFBT(2)).toEqual([]);
  });
});
