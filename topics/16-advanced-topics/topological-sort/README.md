# Topological Sort

## Recognition

- Course schedule / prerequisites
- Alien dictionary
- Build order / compilation order
- Directed **acyclic** graph (DAG) ordering

## Kahn's algorithm (BFS)

1. Compute indegrees
2. Queue all indegree 0
3. Take node, reduce neighbors' indegrees
4. If processed count < n → cycle

See Course Schedule: [`06-graphs/problems/course-schedule.md`](../../06-graphs/problems/course-schedule.md)

## DFS variant

Post-order finish times; reverse finish list. Track visiting/visited states for cycles (`0/1/2` colors).

## Key Extract

Topo = linear order respecting directed edges. Cycle ⇒ impossible. Prefer Kahn in interviews (easy to count processed nodes).
