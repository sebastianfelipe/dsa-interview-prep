export function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = new Array<number>(n).fill(0);
  const stack: number[] = []; // indices, temps decreasing

  for (let i = 0; i < n; i++) {
    while (
      stack.length &&
      temperatures[i]! > temperatures[stack[stack.length - 1]!]!
    ) {
      const j = stack.pop()!;
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
