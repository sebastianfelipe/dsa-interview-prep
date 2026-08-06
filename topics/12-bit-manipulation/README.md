# Bit Manipulation

Bits for XOR tricks, flags, and subset masks (n ≤ 20).

## Patterns

| Pattern | File |
|---------|------|
| XOR | [patterns/xor.md](./patterns/xor.md) |
| Bit masks | [patterns/bit-masks.md](./patterns/bit-masks.md) |

## Worked problems

| Problem | File |
|---------|------|
| Single Number | [problems/single-number.md](./problems/single-number.md) |
| Number of 1 Bits | [problems/hamming-weight.md](./problems/hamming-weight.md) |

## TypeScript notes

- Use `>>>` for unsigned right shift when treating as 32-bit
- `n & (n - 1)` clears lowest set bit
- `n & -n` isolates lowest set bit (two's complement)

## Key Extract

XOR cancels pairs. Masks enumerate subsets in O(2ⁿ).
