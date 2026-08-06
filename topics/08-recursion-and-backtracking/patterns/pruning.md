# Pattern: Pruning

## Recognition

- N-Queens, Sudoku
- Word search
- Any "is there a configuration" search

## Idea

Before recursing, abort if partial solution already illegal (attacking queens, letter mismatch, sum exceeded).

## Key Extract

Pruning turns impossible branches into O(1) rejects. Always ask: "Can I detect failure early?"
