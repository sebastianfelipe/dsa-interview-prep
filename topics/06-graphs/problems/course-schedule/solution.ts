export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const indegree = new Array<number>(numCourses).fill(0);
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    indegree[a] += 1;
  }
  const queue: number[] = [];
  let head = 0;
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }
  let taken = 0;
  while (head < queue.length) {
    const course = queue[head++];
    taken += 1;
    for (const next of graph[course]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  return taken === numCourses;
}
