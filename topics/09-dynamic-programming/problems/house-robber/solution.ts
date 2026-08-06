export function rob(nums: number[]): number {
  let prev2 = 0; // dp[i-2]
  let prev1 = 0; // dp[i-1]
  for (const money of nums) {
    const curr = Math.max(prev1, prev2 + money);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
