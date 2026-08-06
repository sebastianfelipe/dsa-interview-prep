import { describe, it, expect } from 'vitest';
import { hammingWeight } from './solution';

describe('Number of 1 Bits', () => {
  it('is defined', () => {
    expect(hammingWeight).toBeTypeOf('function');
  });
});
