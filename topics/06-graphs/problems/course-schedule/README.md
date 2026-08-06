# Course Schedule

## Problem

`numCourses` courses, prerequisites `[a,b]` means b → a. Return true if you can finish (no cycle).

## Recognition

Directed graph cycle detection / **topological sort**.

## Key Extract

Build graph + indegrees; repeatedly take zero-indegree nodes. If you cannot take all → cycle. See also `16-advanced-topics/topological-sort/`.
