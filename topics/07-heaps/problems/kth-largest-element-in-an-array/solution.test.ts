import { describe, it, expect } from 'vitest';
import { findKthLargest } from './solution';

describe('Kth Largest Element in an Array', () => {
  it('is defined', () => {
    expect(findKthLargest).toBeTypeOf('function');
  });
});
