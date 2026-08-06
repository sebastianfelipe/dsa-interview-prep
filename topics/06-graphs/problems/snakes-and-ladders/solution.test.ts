import { describe, it, expect } from 'vitest';
import { snakesAndLadders } from './solution';

describe('Snakes and Ladders', () => {
  it('example 1', () => {
    const board = [
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 35, -1, -1, 13, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 15, -1, -1, -1, -1],
    ];
    expect(snakesAndLadders(board)).toBe(4);
  });
  it('example 2', () => {
    const board = [
      [-1, -1],
      [-1, 3],
    ];
    expect(snakesAndLadders(board)).toBe(1);
  });
});
