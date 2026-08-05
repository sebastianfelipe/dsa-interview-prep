# Implement Trie (Prefix Tree)

## Problem

Implement `insert`, `search`, `startsWith`.

## Code (TypeScript)

See full class in [`templates/trie.ts`](../../templates/trie.ts).

```ts
class Trie {
  private root = new TrieNode();
  insert(word: string): void { /* walk + create */ }
  search(word: string): boolean { /* walk + isEnd */ }
  startsWith(prefix: string): boolean { /* walk */ }
}
```

## Key Extract

Separate `search` vs `startsWith` only by whether `isEnd` is required. Building block for Word Search II (DFS on board + trie).
