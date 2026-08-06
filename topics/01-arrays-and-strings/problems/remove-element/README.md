# Remove Element

## Problem

Given an integer array `nums` and value `val`, remove all occurrences of `val` in-place. Return `k`, the number of elements not equal to `val`. The first `k` elements of `nums` should contain those values (order may change).

## Recognition

In-place filter by value → two pointers (write/read) or swap-with-end.

## Key Extract

Copy keepers forward with a write index; ignore matches. Return the write index as `k`.
