import { describe, it, expect } from 'vitest';
import { addBinary } from './solution';

describe('Add Binary', () => {
  it('example 1', () => expect(addBinary('11', '1')).toBe('100'));
  it('example 2', () => expect(addBinary('1010', '1011')).toBe('10101'));
});
