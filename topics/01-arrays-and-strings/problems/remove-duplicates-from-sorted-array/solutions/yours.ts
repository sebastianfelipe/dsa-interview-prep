export function removeDuplicates(nums: number[]): number {
  let i = 1;
  while (nums[i] !== undefined) {
    if (nums[i] === nums[i - 1]) {
      nums.splice(i, 1);
      continue;
    }
    i++;
  }

  return nums.length;
}
