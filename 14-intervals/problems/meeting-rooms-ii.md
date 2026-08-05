# Meeting Rooms II

## Problem

Given meeting time intervals, find min number of conference rooms required.

## Approach A — min-heap of end times

Sort by start. Heap holds end times of ongoing meetings. If earliest end ≤ new start, reuse room (pop). Push new end. Max heap size = answer.

## Approach B — sweep

```ts
function minMeetingRooms(intervals: number[][]): number {
  const starts = intervals.map((i) => i[0]!).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]!).sort((a, b) => a - b);
  let rooms = 0;
  let maxRooms = 0;
  let s = 0;
  let e = 0;
  while (s < starts.length) {
    if (starts[s]! < ends[e]!) {
      rooms += 1;
      maxRooms = Math.max(maxRooms, rooms);
      s += 1;
    } else {
      rooms -= 1;
      e += 1;
    }
  }
  return maxRooms;
}
```

## Key Extract

Concurrency peak. Heap of ends or two sorted event arrays.
