# Find Duplicate Subtrees

## Problem

Given the `root` of a binary tree, return all duplicate subtrees. For each kind of duplicate subtree, you only need to return the root node of any one of them. Two trees are duplicate if they have the same structure with the same node values.

## Recognition

Detect identical subtrees → serialize each subtree (postorder) and count occurrences in a map.

## Key Extract

Canonical string like `val,leftSerial,rightSerial`. When a serialization is seen the second time, record that root. Return one root per duplicate shape.
