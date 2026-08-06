import { describe, it, expect } from 'vitest';
import { productExceptSelf } from './solution';

describe('Product of Array Except Self', () => {
  it('is defined', () => {
    expect(productExceptSelf).toBeTypeOf('function');
  });
});
