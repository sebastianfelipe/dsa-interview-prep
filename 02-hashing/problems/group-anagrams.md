# Group Anagrams

## Problem

Group strings that are anagrams of each other.

## Recognition

Grouping by equivalence → **signature key** in a `Map`.

## Approach

Key = sorted characters of the word (or 26-count tuple string).

## Code (TypeScript)

```ts
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of strs) {
    const key = [...word].sort().join("");
    const bucket = groups.get(key);
    if (bucket) bucket.push(word);
    else groups.set(key, [word]);
  }

  return [...groups.values()];
}

/** Faster key for lowercase a-z */
function anagramKey(word: string): string {
  const counts = new Array<number>(26).fill(0);
  for (const ch of word) counts[ch.charCodeAt(0) - 97]! += 1;
  return counts.join("#");
}
```

## Complexity

O(n · L log L) with sort key; O(n · L) with count key. Space O(n · L).

## Key Extract

**Canonical key per group.** Sorting is fine in interviews; mention count-array optimization.
