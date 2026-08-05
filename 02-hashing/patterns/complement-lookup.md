# Pattern: Complement Lookup

## Recognition

- Find two (or more) values that satisfy `a + b = target` / `a - b = k`
- Unsorted array
- Need indices or existence quickly

## Idea

While scanning, query `target - nums[i]` in a `Map` of previously seen values.

## TypeScript

```ts
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>(); // value → index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]!;
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i]!, i);
  }
  return [];
}
```

## Key Extract

**One pass: query complement, then insert current.** Inserting after the query avoids using the same element twice.
