import { describe, it, expect } from 'vitest';
import { mergeTwoLists } from './solution';

describe('Merge Two Sorted Lists', () => {
  it('is defined', () => {
    expect(mergeTwoLists).toBeTypeOf('function');
  });
});
