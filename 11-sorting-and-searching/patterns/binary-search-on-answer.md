# Pattern: Binary Search on Answer

## Recognition

- Minimize the maximum / maximize the minimum
- "Smallest capacity", "split array largest sum", "koko eating bananas"
- You can write `feasible(x): boolean` and if x works, x+1 works (or reverse)

## Template

```ts
let lo = minPossible;
let hi = maxPossible;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (feasible(mid)) hi = mid; // looking for minimum feasible
  else lo = mid + 1;
}
return lo;
```

## Key Extract

The hard part is **feasible()**, not the binary search shell. State monotonicity to the interviewer.
