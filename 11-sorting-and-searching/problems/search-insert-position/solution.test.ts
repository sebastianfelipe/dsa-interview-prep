import { describe, it, expect } from 'vitest';
import { searchInsert } from './solution';

describe('Search Insert Position', () => {
  it('example 1', () => expect(searchInsert([1, 3, 5, 6], 5)).toBe(2));
  it('example 2', () => expect(searchInsert([1, 3, 5, 6], 2)).toBe(1));
  it('example 3', () => expect(searchInsert([1, 3, 5, 6], 7)).toBe(4));
});
