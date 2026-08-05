# Jump Game

## Problem

Each index has jump length `nums[i]`. Can you reach the last index?

## Code (TypeScript)

```ts
function canJump(nums: number[]): boolean {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]!);
  }
  return true;
}
```

## Key Extract

If you ever stand beyond `farthest`, unreachable. Update farthest as you go.
