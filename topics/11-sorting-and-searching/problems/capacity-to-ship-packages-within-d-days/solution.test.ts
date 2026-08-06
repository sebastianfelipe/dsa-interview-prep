import { describe, it, expect } from 'vitest';
import { shipWithinDays } from './solution';

describe('Capacity To Ship Packages Within D Days', () => {
  it('is defined', () => {
    expect(shipWithinDays).toBeTypeOf('function');
  });
});
