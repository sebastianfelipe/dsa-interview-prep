# Hashing

Hash maps/sets turn O(n) scans into O(1) average lookups. First upgrade from brute force in many interviews.

## Patterns

| Pattern | File | When |
|---------|------|------|
| Complement lookup | [patterns/complement-lookup.md](./patterns/complement-lookup.md) | Two sum, pair exists |
| Frequency map | [patterns/frequency-map.md](./patterns/frequency-map.md) | Anagrams, top-k frequent, counting |
| Grouping by key | [patterns/grouping.md](./patterns/grouping.md) | Group anagrams, bucket by signature |

## Worked problems

| Problem | File |
|---------|------|
| Two Sum | [problems/two-sum.md](./problems/two-sum.md) |
| Group Anagrams | [problems/group-anagrams.md](./problems/group-anagrams.md) |
| Top K Frequent Elements | [problems/top-k-frequent.md](./problems/top-k-frequent.md) |

## TypeScript defaults

```ts
const map = new Map<number, number>();
const set = new Set<string>();
```

Avoid plain objects when keys are numbers you care about as numbers, or when key type is composite (use a string signature).

## Key Extract

Ask: "What do I wish I could look up in O(1)?" That value becomes your map key.
