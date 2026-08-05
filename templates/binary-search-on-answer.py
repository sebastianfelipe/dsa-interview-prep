# Binary search on answer (minimize maximum / maximize minimum)

```python
def minimize_max(/* params */):
    def feasible(mid) -> bool:
        # return True if we can achieve the goal when the answer is mid
        ...

    lo, hi = min_possible, max_possible
    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            ans = mid
            hi = mid - 1   # try smaller (for minimize)
            # lo = mid + 1  # use this instead when maximizing
        else:
            lo = mid + 1
    return ans
```

# When to use

- Decision problem is monotonic: if `mid` works, larger/smaller also works in one direction.
- Checking feasibility is O(n) or O(n log n); overall O(n log R) where R is answer range.
