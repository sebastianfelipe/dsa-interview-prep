import { describe, it, expect } from 'vitest';
import { minEatingSpeed } from './solution';

describe('Koko Eating Bananas', () => {
  it('example 1', () => expect(minEatingSpeed([3, 6, 7, 11], 8)).toBe(4));
  it('example 2', () => expect(minEatingSpeed([30, 11, 23, 4, 20], 5)).toBe(30));
  it('example 3', () => expect(minEatingSpeed([30, 11, 23, 4, 20], 6)).toBe(23));
});
