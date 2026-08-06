import { describe, it, expect } from 'vitest';
import { isValid } from './solution';

describe('Valid Parentheses', () => {
  it('valid', () => expect(isValid('()[]{}')).toBe(true));
  it('invalid', () => expect(isValid('(]')).toBe(false));
});
