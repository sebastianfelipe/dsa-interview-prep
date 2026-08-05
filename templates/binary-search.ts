/** Classic binary search — first index of target, or -1. */
export function binarySearch(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/** Lower bound — first index with nums[i] >= target. */
export function lowerBound(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Binary search on answer — minimize maximum capacity style.
 * feasible(x) must be monotonic: if x works, x+1 works.
 */
export function minimizeCapacity(
  weights: number[],
  days: number,
): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);

  const canShip = (capacity: number): boolean => {
    let need = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > capacity) {
        need += 1;
        load = 0;
      }
      load += w;
    }
    return need <= days;
  };

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (canShip(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
