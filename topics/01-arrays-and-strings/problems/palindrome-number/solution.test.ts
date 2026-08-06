import { describe, it, expect } from 'vitest';
import { isPalindrome } from './solution';

describe('Palindrome Number', () => {
  it('example 1', () => expect(isPalindrome(121)).toBe(true));
  it('example 2', () => expect(isPalindrome(-121)).toBe(false));
  it('example 3', () => expect(isPalindrome(10)).toBe(false));
  it('single digit', () => expect(isPalindrome(0)).toBe(true));
});
