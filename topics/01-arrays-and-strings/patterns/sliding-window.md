# Pattern: Sliding Window

## Recognition

- Contiguous **subarray** or **substring**
- Optimize length / sum / count under a constraint
- Phrases: "longest", "shortest", "at most k", "exactly k", "no repeats"

## Template (variable window)

```text
left = 0
for right in 0..n-1:
  add nums[right] into window state
  while window is INVALID:
    remove nums[left] from state
    left += 1
  update answer from window (often right-left+1)
```

**Invariant:** after the `while`, window `[left, right]` is always valid.

## Fixed window

Maintain sum/state of size `k`; slide by adding `nums[i]` and removing `nums[i-k]`.

## State you typically keep

| Need | Structure |
|------|-----------|
| Unique chars | `Set` or last-seen `Map` |
| At most k distinct | `Map` char → count + distinct counter |
| Sum / max | running sum, or deque for max-in-window |

## Complexity

**O(n)** time — each index enters/leaves at most once. Space **O(alphabet)** or **O(k)**.

## TypeScript sketch

```ts
const freq = new Map<string, number>();
let left = 0;
let best = 0;
for (let right = 0; right < s.length; right++) {
  const c = s[right]!;
  freq.set(c, (freq.get(c) ?? 0) + 1);
  while (/* invalid */) {
    const L = s[left]!;
    freq.set(L, freq.get(L)! - 1);
    if (freq.get(L) === 0) freq.delete(L);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
```

## Cousin problems

- Longest Substring Without Repeating Characters
- Minimum Window Substring
- Max Consecutive Ones III
- Fruit Into Baskets (≤ 2 distinct)

## Key Extract

Expand right, shrink left until valid, update answer. The **state update + invalid condition** is the whole problem.
