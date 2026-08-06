export function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1;
  let hi = Math.max(...piles);
  let ans = hi;

  const hoursNeeded = (k: number) =>
    piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (hoursNeeded(mid) <= h) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return ans;
}
