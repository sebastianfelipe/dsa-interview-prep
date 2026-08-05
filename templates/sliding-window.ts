/**
 * Variable sliding window
 * Expand right; shrink left while invalid; track best.
 */
export function longestSubstringWithoutRepeating(s: string): number {
  const lastIndex = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]!;
    const prev = lastIndex.get(ch);
    if (prev !== undefined && prev >= left) {
      left = prev + 1;
    }
    lastIndex.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

/**
 * Fixed window of size k — max sum
 */
export function maxSumSubarrayOfSizeK(nums: number[], k: number): number {
  if (k <= 0 || k > nums.length) return 0;
  let window = 0;
  for (let i = 0; i < k; i++) window += nums[i]!;
  let best = window;
  for (let i = k; i < nums.length; i++) {
    window += nums[i]! - nums[i - k]!;
    best = Math.max(best, window);
  }
  return best;
}
