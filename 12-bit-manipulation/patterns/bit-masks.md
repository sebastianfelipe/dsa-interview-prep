# Pattern: Bit Masks

## Recognition

- n ≤ 20 subsets
- DP on subsets (`dp[mask]`)
- Compact presence sets (e.g., used columns in N-Queens)

```ts
for (let mask = 0; mask < 1 << n; mask++) {
  for (let i = 0; i < n; i++) {
    if (mask & (1 << i)) {
      // element i in subset
    }
  }
}
```

## Key Extract

Bit i set ⇔ element i chosen. Great when n is tiny.
