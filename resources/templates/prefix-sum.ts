/**
 * Prefix sums: prefix[i] = sum of nums[0..i)
 * Range sum nums[l..r] inclusive = prefix[r+1] - prefix[l]
 */
export function buildPrefix(nums: number[]): number[] {
  const prefix = new Array<number>(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i]! + nums[i]!;
  }
  return prefix;
}

export function rangeSum(prefix: number[], left: number, right: number): number {
  return prefix[right + 1]! - prefix[left]!;
}

/**
 * Count subarrays with sum === k using prefix frequency map.
 */
export function subarraySumEqualsK(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let count = 0;

  for (const num of nums) {
    prefix += num;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}
