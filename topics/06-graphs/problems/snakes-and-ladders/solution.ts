export function snakesAndLadders(board: number[][]): number {
  const n = board.length;
  const target = n * n;
  function labelToRC(label: number): [
    number,
    number
  ] {
    const rFromBottom = Math.floor((label - 1) / n);
    const row = n - 1 - rFromBottom;
    const offset = (label - 1) % n;
    const col = rFromBottom % 2 === 0 ? offset : n - 1 - offset;
    return [row, col];
  }
  function destination(label: number): number {
    const [r, c] = labelToRC(label);
    const val = board[r][c];
    return val === -1 ? label : val;
  }
  const visited = new Array<boolean>(target + 1).fill(false);
  const queue: [
    number,
    number
  ][] = [[1, 0]];
  visited[1] = true;
  while (queue.length) {
    const front = queue.shift();
    if (!front) {
      break;
    }
    const [curr, moves] = front;
    if (curr === target) {
      return moves;
    }
    for (let roll = 1; roll <= 6 && curr + roll <= target; roll++) {
      const next = destination(curr + roll);
      if (!visited[next]) {
        visited[next] = true;
        queue.push([next, moves + 1]);
      }
    }
  }
  return -1;
}
