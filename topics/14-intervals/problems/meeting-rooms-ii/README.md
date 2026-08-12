# Meeting Rooms II

## Problem

Given meeting time intervals, find min number of conference rooms required.

## Examples

### Example 1
**Input:** `intervals = [[0, 30], [5, 10], [15, 20]]`
**Output:** `2`
**Explanation:** Need two rooms at the overlapping time.


## Approach A — min-heap of end times

Sort by start. Heap holds end times of ongoing meetings. If earliest end ≤ new start, reuse room (pop). Push new end. Max heap size = answer.

## Approach B — sweep

## Key Extract

Concurrency peak. Heap of ends or two sorted event arrays.
