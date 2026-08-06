import { describe, it, expect } from 'vitest';
import { reverseList } from './solution';

describe('Reverse Linked List', () => {
  it('is defined', () => {
    expect(reverseList).toBeTypeOf('function');
  });
});
