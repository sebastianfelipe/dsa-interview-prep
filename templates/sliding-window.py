# Variable sliding window skeleton

```python
def longest_valid(s, /* constraint params */):
    from collections import defaultdict
    left = 0
    best = 0
    window = defaultdict(int)  # or set / counter / running sum

    for right, x in enumerate(s):
        # 1) expand: include s[right]
        window[x] += 1

        # 2) shrink while invalid
        while not is_valid(window):
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1

        # 3) update answer with valid window [left, right]
        best = max(best, right - left + 1)

    return best
```

# Fixed window of size k

```python
def max_sum_subarray(nums, k):
    cur = sum(nums[:k])
    best = cur
    for i in range(k, len(nums)):
        cur += nums[i] - nums[i - k]
        best = max(best, cur)
    return best
```
