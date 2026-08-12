export function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    const seenIndex = seen.get(need);
    if (seenIndex !== undefined) {
      return [seenIndex, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
