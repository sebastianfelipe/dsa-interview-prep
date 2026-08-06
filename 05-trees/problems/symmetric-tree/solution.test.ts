import { describe, it, expect } from 'vitest';
import { treeFromArray } from '@lib/helpers';
import { isSymmetric } from './solution';

describe('Symmetric Tree', () => {
  it('example 1', () => {
    expect(isSymmetric(treeFromArray([1, 2, 2, 3, 4, 4, 3]))).toBe(true);
  });
  it('example 2', () => {
    expect(isSymmetric(treeFromArray([1, 2, 2, null, 3, null, 3]))).toBe(false);
  });
});
