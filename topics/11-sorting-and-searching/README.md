# Sorting & Searching

Sort to enable two pointers / greedy. Binary search for sorted data or monotonic answers.

## Patterns

| Pattern | File |
|---------|------|
| Classic binary search | [patterns/binary-search.md](./patterns/binary-search.md) |
| Binary search on answer | [patterns/binary-search-on-answer.md](./patterns/binary-search-on-answer.md) |
| Rotated / modified BS | [patterns/rotated-array.md](./patterns/rotated-array.md) |

## Worked problems

| Problem | File |
|---------|------|
| Search in Rotated Sorted Array | [problems/search-rotated.md](./problems/search-rotated.md) |
| Capacity To Ship Packages | [problems/ship-packages.md](./problems/ship-packages.md) |

## TypeScript sort

```ts
nums.sort((a, b) => a - b); // ALWAYS comparator for numbers
```

## Key Extract

If the feasibility of a candidate answer is monotonic, binary search the answer space.
