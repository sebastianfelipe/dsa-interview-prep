# Pattern: Matching Stack

## Recognition

- Parentheses / brackets
- Path simplify (`/a/./b/../c`)
- Nested decode (`3[a2[c]]`)
- Calculator with parentheses

## Idea

Push openers (or pending state). On closer, pop and validate match / apply operation.

## Key Extract

One stack frame per open context. Invalid if pop fails or stack nonempty at end.
