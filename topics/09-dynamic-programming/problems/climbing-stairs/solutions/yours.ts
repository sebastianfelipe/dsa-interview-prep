const calculations: Record<number, number> = {};

export function climbStairs(n: number): number {
  if (n <= 2) {
    return n;
  }

  if (calculations[n] === undefined) {
    calculations[n] = climbStairs(n - 1) + climbStairs(n - 2);
  }

  return calculations[n];
}
