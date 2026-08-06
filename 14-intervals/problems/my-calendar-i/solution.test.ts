import { describe, it, expect } from 'vitest';
import { MyCalendar } from './solution';

describe('My Calendar I', () => {
  it('example 1', () => {
    const cal = new MyCalendar();
    expect(cal.book(10, 20)).toBe(true);
    expect(cal.book(15, 25)).toBe(false);
    expect(cal.book(20, 30)).toBe(true);
  });
});
