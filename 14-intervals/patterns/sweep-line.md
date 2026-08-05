# Pattern: Sweep Line

## Recognition

- Meeting rooms II (min rooms)
- Max concurrent events
- Skyline (harder)

## Idea

Convert to events: `+1` at start, `-1` at end. Sort events (ends before starts on ties if intervals are half-open). Track running count + max.

## Key Extract

Peaks of the running sum = max concurrency.
