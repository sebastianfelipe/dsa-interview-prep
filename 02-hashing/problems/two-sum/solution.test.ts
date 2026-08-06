import { describe, it, expect } from 'vitest';
import { twoSum } from './solution';

describe('Two Sum', () => {
  it('example 1', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });
  it('example 2', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });
});
