# Min Stack

## Problem

Design a stack that supports push, pop, top, and **getMin** in O(1).

## Recognition

Auxiliary stack tracking minima (or store pairs `[value, minSoFar]`).

## Key Extract

Each push records the min **including** that value. Pop both stacks together. Pattern: augment stack with derived state.
