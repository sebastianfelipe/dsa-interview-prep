export function canVisitAllRooms(rooms: number[][]): boolean {
  const visited = new Array<boolean>(rooms.length).fill(false);
  const stack = [0];
  visited[0] = true;
  let count = 1;

  while (stack.length) {
    const room = stack.pop();
    if (room === undefined) break;
    for (const key of rooms[room]) {
      if (!visited[key]) {
        visited[key] = true;
        count++;
        stack.push(key);
      }
    }
  }
  return count === rooms.length;
}
