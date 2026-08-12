# Top K Frequent Elements

## Problem

Return the `k` most frequent elements in `nums`.

## Examples

### Example 1
**Input:** `nums = [1, 1, 1, 2, 2, 3]`, `k = 2`
**Output:** `[1, 2]`
**Explanation:** `1` appears thrice, `2` twice.


## Recognition

Frequency map + top-k → **heap of size k** or **bucket sort by frequency**.

## Approach (bucket — O(n))

1. Count frequencies.
2. `buckets[freq] = list of values with that freq`.
3. Scan buckets from high to low until k collected.

## Complexity

Bucket: O(n) time/space. Heap alternative: O(n log k).

## Key Extract

Freq map first. Then choose **heap** (simple) or **buckets** (linear). Same pattern as Top K Frequent Words (add tie-break sorting).
