# Group Anagrams

## Problem

Group strings that are anagrams of each other.

## Recognition

Grouping by equivalence → **signature key** in a `Map`.

## Approach

Key = sorted characters of the word (or 26-count tuple string).

## Complexity

O(n · L log L) with sort key; O(n · L) with count key. Space O(n · L).

## Key Extract

**Canonical key per group.** Sorting is fine in interviews; mention count-array optimization.
