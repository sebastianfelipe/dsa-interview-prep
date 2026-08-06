import { describe, it, expect } from 'vitest';
import { dailyTemperatures } from './solution';

describe('Daily Temperatures', () => {
  it('is defined', () => {
    expect(dailyTemperatures).toBeTypeOf('function');
  });
});
