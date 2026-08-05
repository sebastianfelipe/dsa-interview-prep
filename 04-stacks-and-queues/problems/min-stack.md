# Min Stack

## Problem

Design a stack that supports push, pop, top, and **getMin** in O(1).

## Recognition

Auxiliary stack tracking minima (or store pairs `[value, minSoFar]`).

## Code (TypeScript)

```ts
class MinStack {
  private stack: number[] = [];
  private mins: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const min = this.mins.length ? Math.min(val, this.mins[this.mins.length - 1]!) : val;
    this.mins.push(min);
  }

  pop(): void {
    this.stack.pop();
    this.mins.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1]!;
  }

  getMin(): number {
    return this.mins[this.mins.length - 1]!;
  }
}
```

## Key Extract

Each push records the min **including** that value. Pop both stacks together. Pattern: augment stack with derived state.
