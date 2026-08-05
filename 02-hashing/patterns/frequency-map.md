# Pattern: Frequency Map

## Recognition

- Counts of characters/numbers matter
- Anagram checks
- "Most frequent", "k frequent", "appear exactly once"

## Idea

```ts
const freq = new Map<T, number>();
for (const x of items) freq.set(x, (freq.get(x) ?? 0) + 1);
```

Then either:

- Compare two freq maps
- Feed entries into a heap / bucket sort for top-k

## Key Extract

Counting is often half the problem; the second half is **what you do with the counts** (compare, heap, buckets).
