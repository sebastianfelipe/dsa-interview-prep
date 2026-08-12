export function searchInsert(nums: number[], target: number): number {
  const index = nums.findIndex((num) => num >= target);
  return index === -1 ? nums.length : index;
}
