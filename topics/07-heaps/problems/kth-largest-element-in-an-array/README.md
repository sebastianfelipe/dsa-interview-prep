# Kth Largest Element in an Array

## Problem

Find the kth largest element in unsorted `nums`.

## Recognition

Top-K → min-heap size k (or Quickselect for average O(n)).

## Key Extract

Min-heap of size k → peek is kth largest. Mention Quickselect if they ask for better average time.
