export function shipWithinDays(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);
  const can = (cap: number): boolean => {
    let need = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > cap) {
        need += 1;
        load = 0;
      }
      load += w;
    }
    return need <= days;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (can(mid)) {
      hi = mid;
    }
    else {
      lo = mid + 1;
    }
  }
  return lo;
}
