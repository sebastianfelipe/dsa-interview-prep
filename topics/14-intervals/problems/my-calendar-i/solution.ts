export class MyCalendar {
  private events: [number, number][] = [];

  book(start: number, end: number): boolean {
    for (const [s, e] of this.events) {
      if (start < e && s < end) return false;
    }
    this.events.push([start, end]);
    this.events.sort((a, b) => a[0] - b[0]);
    return true;
  }
}
