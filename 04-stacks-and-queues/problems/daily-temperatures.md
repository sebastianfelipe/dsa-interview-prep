# Daily Temperatures

## Problem

`temperatures[i]` is degrees on day i. Return array `answer` where `answer[i]` is days until a warmer temperature, or 0.

## Recognition

**Next greater element** → monotonic decreasing stack of indices.

## Walkthrough

`[73,74,75,71,69,72,76,73]`

When 74 arrives, 73 pops → answer[0]=1. When 76 arrives, 72,69,71,... resolve, etc.

## Code (TypeScript)

```ts
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = new Array<number>(n).fill(0);
  const stack: number[] = []; // indices, temps decreasing

  for (let i = 0; i < n; i++) {
    while (
      stack.length &&
      temperatures[i]! > temperatures[stack[stack.length - 1]!]!
    ) {
      const j = stack.pop()!;
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
```

## Complexity

O(n) time — each index push/pop once. O(n) space.

## Key Extract

Unresolved colder days sit on stack; first warmer day resolves them. Template for all next-greater problems.
