import { describe, it, expect } from 'vitest';
import { longestCommonPrefix } from './solution';

describe('Longest Common Prefix', () => {
  it('example 1', () => expect(longestCommonPrefix(['flower', 'flow', 'flight'])).toBe('fl'));
  it('example 2', () => expect(longestCommonPrefix(['dog', 'racecar', 'car'])).toBe(''));
});
