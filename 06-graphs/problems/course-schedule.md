# Course Schedule

## Problem

`numCourses` courses, prerequisites `[a,b]` means b → a. Return true if you can finish (no cycle).

## Recognition

Directed graph cycle detection / **topological sort**.

## Code (TypeScript) — Kahn's BFS

```ts
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const indegree = new Array<number>(numCourses).fill(0);
  const graph: number[][] = Array.from({ length: numCourses }, () => []);

  for (const [a, b] of prerequisites) {
    graph[b]!.push(a);
    indegree[a]! += 1;
  }

  const queue: number[] = [];
  let head = 0;
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);

  let taken = 0;
  while (head < queue.length) {
    const course = queue[head++]!;
    taken += 1;
    for (const next of graph[course]!) {
      indegree[next]! -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return taken === numCourses;
}
```

## Key Extract

Build graph + indegrees; repeatedly take zero-indegree nodes. If you cannot take all → cycle. See also `16-advanced-topics/topological-sort/`.
