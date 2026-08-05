# Pattern: Queue / Deque

## Recognition

- BFS levels
- Sliding window maximum (monotonic deque)
- Task scheduling / stream of events in order

## Sliding window maximum sketch

Deque stores indices with **decreasing values**. Front is max. Pop back while smaller than incoming; pop front when out of window.

## Key Extract

Queue = process in arrival order. Monotonic deque = window extrema in O(n).
