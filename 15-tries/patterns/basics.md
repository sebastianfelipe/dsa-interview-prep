# Pattern: Trie Basics

## Node

```ts
class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}
```

## Operations

- `insert(word)` — walk/create nodes; mark `isEnd`
- `search(word)` — walk; require `isEnd`
- `startsWith(prefix)` — walk only

## Key Extract

Time O(L) per op. Space trades memory for prefix speed. Map vs `children[26]` array for a-z.
