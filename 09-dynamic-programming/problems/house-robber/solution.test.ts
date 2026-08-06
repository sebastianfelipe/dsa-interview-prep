import { describe, it, expect } from 'vitest';
import { rob } from './solution';

describe('House Robber', () => {
  it('is defined', () => {
    expect(rob).toBeTypeOf('function');
  });
});
