import { describe, it, expect } from 'vitest';
import { merge } from './solution';

describe('Merge Sorted Array', () => {
  it('example 1', () => {
    const nums1 = [1, 2, 3, 0, 0, 0];
    merge(nums1, 3, [2, 5, 6], 3);
    expect(nums1).toEqual([1, 2, 2, 3, 5, 6]);
  });
  it('example 2', () => {
    const nums1 = [1];
    merge(nums1, 1, [], 0);
    expect(nums1).toEqual([1]);
  });
  it('example 3', () => {
    const nums1 = [0];
    merge(nums1, 0, [1], 1);
    expect(nums1).toEqual([1]);
  });
});
