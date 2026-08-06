import { describe, it, expect } from 'vitest';
import { strStr } from './solution';

describe('Find the Index of the First Occurrence in a String', () => {
  it('example 1', () => expect(strStr('sadbutsad', 'sad')).toBe(0));
  it('example 2', () => expect(strStr('leetcode', 'leeto')).toBe(-1));
});
