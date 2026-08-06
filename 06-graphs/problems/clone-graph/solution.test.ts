import { describe, it, expect } from 'vitest';
import { cloneGraph } from './solution';

describe('Clone Graph', () => {
  it('is defined', () => {
    expect(cloneGraph).toBeTypeOf('function');
  });
});
