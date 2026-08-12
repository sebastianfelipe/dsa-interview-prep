# My Calendar I

## Problem

Implement a `MyCalendar` class to store events as half-open intervals `[start, end)`. A call to `book(start, end)` returns `true` and stores the event if it does not cause a double booking; otherwise returns `false` and does not store it. Double booking means two events with nonempty intersection.

## Examples

### Example
`book(10, 20) → true`, `book(15, 25) → false` (overlaps), `book(20, 30) → true` (touches OK).


## Recognition

Interval booking without overlap → keep sorted intervals and binary-search insertion point, or linear scan for interview.

## Key Extract

Two intervals `[a,b)` and `[c,d)` overlap iff `a < d && c < b`. On success insert keeping list sorted by start.
