# Min Stack

## Problem

Design a stack that supports push, pop, top, and **getMin** in O(1).

## Examples

### Example
**Operations:** `push(-2)`, `push(0)`, `push(-3)`, `getMin()`, `pop()`, `top()`, `getMin()`
**Outputs:** `getMin → -3`, `top → 0`, `getMin → -2`.


## Recognition

Auxiliary stack tracking minima (or store pairs `[value, minSoFar]`).

## Key Extract

Each push records the min **including** that value. Pop both stacks together. Pattern: augment stack with derived state.
