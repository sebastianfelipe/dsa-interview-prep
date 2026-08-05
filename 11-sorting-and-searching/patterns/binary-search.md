# Pattern: Binary Search

## Recognition

- Sorted array
- Find target / boundary (first true, lower bound)

## Template

```ts
let lo = 0;
let hi = nums.length - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (nums[mid] === target) return mid;
  if (nums[mid]! < target) lo = mid + 1;
  else hi = mid - 1;
}
```

Lower bound (`first ≥ target`): `while (lo < hi)` with `hi = mid` / `lo = mid + 1`.

## Key Extract

Avoid overflow mid formula (still good habit). Be explicit: looking for exact vs boundary.
