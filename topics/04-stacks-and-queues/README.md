# Stacks & Queues

LIFO/FIFO structures for matching, deferred processing, and monotonic relationships.

## Patterns

| Pattern | File |
|---------|------|
| Matching / nesting | [patterns/matching-stack.md](./patterns/matching-stack.md) |
| Monotonic stack | [patterns/monotonic-stack.md](./patterns/monotonic-stack.md) |
| Queue / deque | [patterns/queue-deque.md](./patterns/queue-deque.md) |

## Worked problems

| Problem | File |
|---------|------|
| Valid Parentheses | [problems/valid-parentheses.md](./problems/valid-parentheses.md) |
| Daily Temperatures | [problems/daily-temperatures.md](./problems/daily-temperatures.md) |
| Min Stack | [problems/min-stack.md](./problems/min-stack.md) |

## TypeScript

```ts
const stack: number[] = [];
stack.push(x);
stack.pop();
stack[stack.length - 1]; // peek

// Queue: prefer head index over shift()
const q: number[] = [];
let head = 0;
q.push(x);
const v = q[head++];
```

## Key Extract

Stack ↔ nested structure / previous unresolved candidates. Monotonic stack ↔ next greater/smaller.
