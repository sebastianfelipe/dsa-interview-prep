import { describe, it, expect } from 'vitest';
import { isValidBST } from './solution';

describe('Validate Binary Search Tree', () => {
  it('is defined', () => {
    expect(isValidBST).toBeTypeOf('function');
  });
});
