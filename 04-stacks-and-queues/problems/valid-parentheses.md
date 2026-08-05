# Valid Parentheses

## Problem

Given a string of `()[]{}`, determine if it is valid.

## Recognition

Nested matching → **stack**.

## Code (TypeScript)

```ts
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pair: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pair[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

## Key Extract

Push openers; on closer, top must match. Empty stack at end. Same skeleton for path simplify and decode-string.
