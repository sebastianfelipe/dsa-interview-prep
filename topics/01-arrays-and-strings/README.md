# Arrays & Strings

The highest-frequency interview topic. Most "array" problems are really **pattern** problems wearing array clothing.

## Patterns in this folder

| Pattern | File | When |
|---------|------|------|
| Two pointers | [patterns/two-pointers.md](./patterns/two-pointers.md) | Sorted, pair sums, in-place compact |
| Sliding window | [patterns/sliding-window.md](./patterns/sliding-window.md) | Contiguous subarray/substring + constraint |
| Prefix sum | [patterns/prefix-sum.md](./patterns/prefix-sum.md) | Range sums, subarray sum = k |
| Kadane | [patterns/kadane.md](./patterns/kadane.md) | Maximum subarray sum |

## Worked problems

| Problem | Pattern | File |
|---------|---------|------|
| Two Sum II (sorted) | Two pointers | [problems/two-sum-ii.md](./problems/two-sum-ii.md) |
| Longest Substring Without Repeating | Sliding window | [problems/longest-substring-without-repeating.md](./problems/longest-substring-without-repeating.md) |
| Subarray Sum Equals K | Prefix + hash | [problems/subarray-sum-equals-k.md](./problems/subarray-sum-equals-k.md) |
| Maximum Subarray | Kadane | [problems/maximum-subarray.md](./problems/maximum-subarray.md) |
| Product of Array Except Self | Prefix/suffix | [problems/product-except-self.md](./problems/product-except-self.md) |

## First-pass checklist

1. Contiguous? → window / prefix / Kadane  
2. Sorted or sortable? → two pointers / binary search  
3. Need counts or complements? → `Map`  
4. In-place rewrite? → slow/fast pointers  

## Key Extract

"Array problem" is not a strategy. Name the **pattern** in the first minute.
