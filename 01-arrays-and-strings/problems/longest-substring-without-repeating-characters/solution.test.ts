import { describe, it, expect } from 'vitest';
import { lengthOfLongestSubstring } from './solution';

describe('Longest Substring Without Repeating', () => {
  it('abcabcbb', () => expect(lengthOfLongestSubstring('abcabcbb')).toBe(3));
  it('bbbbb', () => expect(lengthOfLongestSubstring('bbbbb')).toBe(1));
});
