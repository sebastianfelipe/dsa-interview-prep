# Pattern: Monotonic Stack

## Recognition

- Next greater / next smaller element
- Daily temperatures
- Largest rectangle in histogram
- Sum of subarray minimums

## Idea

Maintain indices in increasing or decreasing order of values. When a new value breaks the order, pop and **resolve** those indices (their next greater is the new value).

```ts
const stack: number[] = []; // indices, e.g. decreasing values
const answer = new Array<number>(n).fill(0);

for (let i = 0; i < n; i++) {
  while (stack.length && nums[i]! > nums[stack[stack.length - 1]!]!) {
    const j = stack.pop()!;
    answer[j] = i - j; // e.g. days until warmer
  }
  stack.push(i);
}
```

## Key Extract

Stack holds **unresolved** indices. Pop when current element is the answer for them. Decide increasing vs decreasing from the question (greater vs smaller).
