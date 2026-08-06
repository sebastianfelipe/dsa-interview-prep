import { describe, it, expect } from 'vitest';
import { mySqrt } from './solution';

describe('Sqrt(x)', () => {
  it('example 1', () => expect(mySqrt(4)).toBe(2));
  it('example 2', () => expect(mySqrt(8)).toBe(2));
  it('zero', () => expect(mySqrt(0)).toBe(0));
});
