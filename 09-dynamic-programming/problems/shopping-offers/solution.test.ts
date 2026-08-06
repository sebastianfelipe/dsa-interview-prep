import { describe, it, expect } from 'vitest';
import { shoppingOffers } from './solution';

describe('Shopping Offers', () => {
  it('example 1', () => {
    expect(shoppingOffers([2, 5], [[3, 0, 5], [1, 2, 10]], [3, 2])).toBe(14);
  });
  it('example 2', () => {
    expect(shoppingOffers([2, 3, 4], [[1, 1, 0, 4], [2, 2, 1, 9]], [1, 2, 1])).toBe(11);
  });
});
