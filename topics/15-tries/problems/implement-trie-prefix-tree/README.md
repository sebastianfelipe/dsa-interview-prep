# Implement Trie (Prefix Tree)

## Problem

Implement `insert`, `search`, `startsWith`.

## Examples

### Example
`insert("apple")`, `search("apple") → true`, `search("app") → false`, `startsWith("app") → true`, `insert("app")`, `search("app") → true`.


## Key Extract

Separate `search` vs `startsWith` only by whether `isEnd` is required. Building block for Word Search II (DFS on board + trie).
