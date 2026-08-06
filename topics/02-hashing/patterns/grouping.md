# Pattern: Grouping by Signature

## Recognition

- Group items that share an equivalence (anagrams, shifted strings, etc.)
- Need a canonical **key** per group

## Idea

```ts
const groups = new Map<string, string[]>();
for (const word of strs) {
  const key = [...word].sort().join(""); // signature
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key)!.push(word);
}
return [...groups.values()];
```

Better anagram key when alphabet is tiny: count array serialized to string.

## Key Extract

Design a **collision-free signature**. Sorting chars is simple; count-arrays are faster for large n / short strings.
