import { describe, it, expect } from 'vitest';
import { removeElement } from './solution';

describe('Remove Element', () => {
  it('example 1', () => {
    const nums = [3, 2, 2, 3];
    const k = removeElement(nums, 3);
    expect(k).toBe(2);
    expect(nums.slice(0, k).sort()).toEqual([2, 2]);
  });
  it('example 2', () => {
    const nums = [0, 1, 2, 2, 3, 0, 4, 2];
    const k = removeElement(nums, 2);
    expect(k).toBe(5);
    expect(nums.slice(0, k).sort()).toEqual([0, 0, 1, 3, 4]);
  });
});
