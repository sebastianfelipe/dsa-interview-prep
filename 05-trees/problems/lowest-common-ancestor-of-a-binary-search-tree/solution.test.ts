import { describe, it, expect } from 'vitest';
import { lowestCommonAncestor } from './solution';

describe('Lowest Common Ancestor of a Binary Search Tree', () => {
  it('is defined', () => {
    expect(lowestCommonAncestor).toBeTypeOf('function');
  });
});
