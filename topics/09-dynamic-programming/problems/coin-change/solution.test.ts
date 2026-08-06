import { describe, it, expect } from 'vitest';
import { coinChange } from './solution';

describe('Coin Change', () => {
  it('is defined', () => {
    expect(coinChange).toBeTypeOf('function');
  });
});
