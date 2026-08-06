import { describe, it, expect } from 'vitest';
import { treeFromArray } from '@lib/helpers';
import { inorderTraversal } from './solution';

describe('Binary Tree Inorder Traversal', () => {
  it('example 1', () => {
    expect(inorderTraversal(treeFromArray([1, null, 2, 3]))).toEqual([1, 3, 2]);
  });
  it('example 2', () => {
    expect(inorderTraversal(treeFromArray([]))).toEqual([]);
  });
  it('example 3', () => {
    expect(inorderTraversal(treeFromArray([1]))).toEqual([1]);
  });
});
