export function removeElement(nums: number[], val: number): number {
  let i = 0;
  while (nums[i] !== undefined) {
    if (nums[i] === val) {
      nums.splice(i, 1);
      continue;
    }
    i++;
  }

  return nums.length;
}
