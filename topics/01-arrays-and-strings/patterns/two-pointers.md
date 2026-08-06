# Pattern: Two Pointers

## Recognition

- Array is **sorted**, or sorting does not break the question
- Looking for a **pair / triplet** with a sum or condition
- Need to **partition / compact** in place (remove dups, move zeros)
- Palindrome check on string/array

## Variants

### 1. Opposite ends

```text
left = 0, right = n-1
while left < right:
  if too small → left++
  if too big   → right--
  if perfect   → record / return
```

**Invariant:** everything outside `[left, right]` has been eliminated as impossible.

### 2. Same direction (slow / fast)

```text
slow writes the next kept position
fast scans
```

**Invariant:** `nums[0..slow)` is valid compacted output.

## Complexity

Usually **O(n)** time after sort (**O(n log n)** if you must sort), **O(1)** extra space.

## TypeScript sketch

```ts
let left = 0;
let right = nums.length - 1;
while (left < right) {
  const sum = nums[left]! + nums[right]!;
  if (sum === target) return [left, right];
  if (sum < target) left++;
  else right--;
}
```

## Cousin problems

- Container With Most Water
- 3Sum
- Valid Palindrome
- Remove Duplicates from Sorted Array
- Trapping Rain Water (two pointers or stack)

## Key Extract

Move the pointer that **fixes the violation**. State the invariant out loud.
