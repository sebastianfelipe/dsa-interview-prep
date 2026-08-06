import { describe, it, expect } from 'vitest';
import { mergeKLists } from './solution';

describe('Merge k Sorted Lists', () => {
  it('is defined', () => {
    expect(mergeKLists).toBeTypeOf('function');
  });
});
