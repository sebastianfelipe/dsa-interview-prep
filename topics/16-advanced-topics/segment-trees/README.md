# Segment Trees (Overview)

## Recognition

- Many range sum/min queries **with updates**
- Static ranges → prefix sums enough; updates → fenwick/segment tree

## Interview reality

Rare in general software interviews. More common in competitive programming. Know the **idea**:

- Tree over array ranges
- Each node stores aggregate of its segment
- Query/update O(log n)

## When to mention

If constraints say n ≤ 1e5 with q ≤ 1e5 mixed updates/queries, say: "I'd use a Fenwick tree or segment tree for O(log n) ops."

## Key Extract

Prefer prefix sums / sparse tables when no updates. Reach for Fenwick/segment when updates appear.
