# Merge Sorted Array

## Problem

`nums1` has length `m + n` with the first `m` elements sorted and the rest zeros as buffer. `nums2` has `n` sorted elements. Merge `nums2` into `nums1` in sorted order (mutate `nums1`).

## Recognition

Two sorted arrays + in-place merge into larger buffer → fill from the back.

## Key Extract

Start write at `m+n-1`. Compare tails of both arrays and place the larger value. Filling backward avoids overwriting unread values in `nums1`.
