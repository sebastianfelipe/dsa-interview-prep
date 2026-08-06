import { describe, it, expect } from 'vitest';
import { plusOne } from './solution';

describe('Plus One', () => {
  it('example 1', () => expect(plusOne([1, 2, 3])).toEqual([1, 2, 4]));
  it('example 2', () => expect(plusOne([4, 3, 2, 1])).toEqual([4, 3, 2, 2]));
  it('example 3', () => expect(plusOne([9])).toEqual([1, 0]));
});
