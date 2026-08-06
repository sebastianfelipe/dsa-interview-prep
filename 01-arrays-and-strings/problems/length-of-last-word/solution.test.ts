import { describe, it, expect } from 'vitest';
import { lengthOfLastWord } from './solution';

describe('Length of Last Word', () => {
  it('example 1', () => expect(lengthOfLastWord('Hello World')).toBe(5));
  it('example 2', () => expect(lengthOfLastWord('   fly me   to   the moon  ')).toBe(4));
  it('example 3', () => expect(lengthOfLastWord('luffy is still joyboy')).toBe(6));
});
