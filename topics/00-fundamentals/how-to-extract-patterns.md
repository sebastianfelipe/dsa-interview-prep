# How to Extract Patterns

Solving a problem once is not enough. You need a **reusable mental tool**.

## After every problem, answer these 5 questions

1. **Recognition:** What words/constraints made me pick this pattern?
2. **Invariant:** What was always true (e.g., window is valid, stack is decreasing)?
3. **State:** What variables did I maintain?
4. **Transition:** How did state update when I moved the pointer / took a decision?
5. **Complexity tradeoff:** What did I spend (space/time) to get the win?

Write those into the **Key Extract** of each problem file in this repo — or into your own notes.

## Pattern naming helps recall

Prefer names like:

- "sliding window — longest substring with ≤ k distinct"
- "two pointers — sorted pair sum"
- "monotonic stack — next greater element"
- "DP — unbounded knapsack on coins"

Over vague labels like "array problem."

## Transfer test

You understand a pattern when you can solve a **new** problem that shares recognition signals but different story (e.g., fruits into baskets ≈ longest substring with 2 distinct chars).

## Study loop

```text
1. Attempt 20–30 min without looking
2. Read solution + Key Extract
3. Re-code from memory next day
4. Link to 1–2 cousin problems in same pattern
```

## Key Extract

Patterns are recognition rules + maintained invariants + state transitions — not memorized code.
