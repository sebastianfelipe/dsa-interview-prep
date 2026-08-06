export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (start: number): void => {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]!);
      dfs(i + 1);
      path.pop();
    }
  };

  dfs(0);
  return result;
}
