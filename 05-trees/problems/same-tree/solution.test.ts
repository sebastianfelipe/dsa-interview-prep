import { describe, it, expect } from 'vitest';
import { treeFromArray } from '@lib/helpers';
import { isSameTree } from './solution';

describe('Same Tree', () => {
  it('example 1', () => {
    expect(isSameTree(treeFromArray([1, 2, 3]), treeFromArray([1, 2, 3]))).toBe(true);
  });
  it('example 2', () => {
    expect(isSameTree(treeFromArray([1, 2]), treeFromArray([1, null, 2]))).toBe(false);
  });
  it('example 3', () => {
    expect(isSameTree(treeFromArray([1, 2, 1]), treeFromArray([1, 1, 2]))).toBe(false);
  });
});
