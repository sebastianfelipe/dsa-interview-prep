import { describe, it, expect } from 'vitest';
import { treeFromArray } from '@lib/helpers';
import { BSTIterator } from './solution';

describe('Binary Search Tree Iterator', () => {
  it('example 1', () => {
    const it = new BSTIterator(treeFromArray([7, 3, 15, null, null, 9, 20]));
    expect(it.next()).toBe(3);
    expect(it.next()).toBe(7);
    expect(it.hasNext()).toBe(true);
    expect(it.next()).toBe(9);
    expect(it.hasNext()).toBe(true);
    expect(it.next()).toBe(15);
    expect(it.hasNext()).toBe(true);
    expect(it.next()).toBe(20);
    expect(it.hasNext()).toBe(false);
  });
});
