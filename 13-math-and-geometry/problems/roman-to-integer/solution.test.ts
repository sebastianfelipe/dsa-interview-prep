import { describe, it, expect } from 'vitest';
import { romanToInt } from './solution';

describe('Roman to Integer', () => {
  it('example 1', () => expect(romanToInt('III')).toBe(3));
  it('example 2', () => expect(romanToInt('LVIII')).toBe(58));
  it('example 3', () => expect(romanToInt('MCMXCIV')).toBe(1994));
});
