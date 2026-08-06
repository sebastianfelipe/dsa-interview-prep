# Merge Two Sorted Lists

## Problem

Merge two sorted lists into one sorted list.

## Recognition

Dummy head + two-pointer merge (like merge step of merge sort).

## Key Extract

**Dummy + tail.** Always attach the smaller head; splice remainder when one list ends. Same idea as merge k lists (with a heap of heads).
