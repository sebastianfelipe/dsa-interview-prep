import { describe, it, expect } from 'vitest';
import { listFromArray, listToArray } from '@lib/helpers';
import { deleteDuplicates } from './solution';

describe('Remove Duplicates from Sorted List', () => {
  it('example 1', () => {
    expect(listToArray(deleteDuplicates(listFromArray([1, 1, 2])))).toEqual([1, 2]);
  });
  it('example 2', () => {
    expect(listToArray(deleteDuplicates(listFromArray([1, 1, 2, 3, 3])))).toEqual([1, 2, 3]);
  });
});
