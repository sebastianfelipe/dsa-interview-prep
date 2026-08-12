export function mySqrt(x: number): number {
  if (x < 2) {
    return x;
  }
  let lo = 1;
  let hi = Math.floor(x / 2);
  let ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (mid <= Math.floor(x / mid)) {
      ans = mid;
      lo = mid + 1;
    }
    else {
      hi = mid - 1;
    }
  }
  return ans;
}
