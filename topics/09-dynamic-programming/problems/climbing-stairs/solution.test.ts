import { describe, it, expect } from 'vitest';
import { climbStairs } from './solution';

describe('Climbing Stairs', () => {
  it('n=2', () => expect(climbStairs(2)).toBe(2));
  it('n=3', () => expect(climbStairs(3)).toBe(3));
  it('n=5', () => expect(climbStairs(5)).toBe(8));
});
