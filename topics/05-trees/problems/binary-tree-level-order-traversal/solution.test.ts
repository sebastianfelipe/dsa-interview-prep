import { describe, it, expect } from 'vitest';
import { levelOrder } from './solution';

describe('Binary Tree Level Order Traversal', () => {
  it('is defined', () => {
    expect(levelOrder).toBeTypeOf('function');
  });
});
