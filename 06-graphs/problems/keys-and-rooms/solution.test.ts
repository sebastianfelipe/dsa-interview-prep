import { describe, it, expect } from 'vitest';
import { canVisitAllRooms } from './solution';

describe('Keys and Rooms', () => {
  it('example 1', () => expect(canVisitAllRooms([[1], [2], [3], []])).toBe(true));
  it('example 2', () => expect(canVisitAllRooms([[1, 3], [3, 0, 1], [2], [0]])).toBe(false));
});
