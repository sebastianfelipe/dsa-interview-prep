export function singleNumber(nums: number[]): number {
  let x = 0;
  for (const n of nums) {
    x ^= n;
  }
  return x;
}
