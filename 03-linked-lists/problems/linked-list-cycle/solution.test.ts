import { describe, it, expect } from 'vitest';
import { hasCycle } from './solution';

describe('Linked List Cycle', () => {
  it('is defined', () => {
    expect(hasCycle).toBeTypeOf('function');
  });
});
