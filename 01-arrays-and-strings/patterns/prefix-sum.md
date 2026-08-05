# Pattern: Prefix Sum

## Recognition

- Many range-sum queries
- Count / find subarrays with sum `k` (or divisible by k)
- Need sum of `nums[i..j]` in O(1) after O(n) prep

## Core identity

```text
prefix[0] = 0
prefix[i+1] = prefix[i] + nums[i]
sum(i..j) = prefix[j+1] - prefix[i]
```

## Subarray sum = k trick

If `prefix[r] - prefix[l] === k`, then subarray `(l .. r-1]` sums to k.  
So for each `prefix`, look up how many times `prefix - k` was seen.

```ts
const seen = new Map<number, number>([[0, 1]]);
let prefix = 0;
let count = 0;
for (const num of nums) {
  prefix += num;
  count += seen.get(prefix - k) ?? 0;
  seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
}
```

## Complexity

O(n) time, O(n) space for the map.

## Cousin problems

- Subarray Sum Equals K
- Contiguous Array (0/1 → -1/+1)
- Range Sum Query - Immutable
- Product of Array Except Self (prefix/suffix products)

## Key Extract

Convert range problems into **difference of prefixes**. Pair with a hash map when counting complements.
