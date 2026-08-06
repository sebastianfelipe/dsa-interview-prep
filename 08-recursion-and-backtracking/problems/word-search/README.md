# Word Search

## Problem

Given a board and a word, return whether the word exists in the grid (adjacent cells, no reuse of a cell).

## Recognition

Grid DFS backtracking + mark visited.

## Key Extract

Match char → mark → explore 4 dirs → unmark. Start DFS from every cell. Trie helps for Word Search II.
