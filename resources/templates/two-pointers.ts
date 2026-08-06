/**
 * Two pointers — opposite ends (sorted pair / container problems)
 * Invariant: answer lies between left and right; move the limiting side.
 */
export function twoSumSorted(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left]! + nums[right]!;
    if (sum === target) return [left, right];
    if (sum < target) left += 1;
    else right -= 1;
  }
  return null;
}

/**
 * Two pointers — same direction (fast writer / slow reader)
 * Invariant: [0..slow) is the "kept" region.
 */
export function removeDuplicatesSorted(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow - 1]) {
      nums[slow] = nums[fast]!;
      slow += 1;
    }
  }
  return slow;
}
