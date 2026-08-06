import { describe, it, expect } from 'vitest';
import { MinStack } from './solution';

describe('Min Stack', () => {
  it('constructs', () => {
    const obj = new MinStack();
    expect(obj).toBeDefined();
  });
});
