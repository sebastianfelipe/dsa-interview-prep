import { describe, it, expect } from 'vitest';
import { canFinish } from './solution';

describe('Course Schedule', () => {
  it('is defined', () => {
    expect(canFinish).toBeTypeOf('function');
  });
});
