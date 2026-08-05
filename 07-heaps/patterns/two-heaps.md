# Pattern: Two Heaps (Running Median)

## Recognition

- Find median from data stream
- Maintain balanced lower/upper halves

## Idea

- Max-heap `low` for smaller half
- Min-heap `high` for larger half
- Rebalance so sizes differ by ≤ 1
- Median = top of larger / average of tops

## Key Extract

Two heaps split the ordered set at the median. Rebalance after every insert.
