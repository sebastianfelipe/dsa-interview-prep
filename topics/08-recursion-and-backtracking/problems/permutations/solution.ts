export function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  const path: number[] = [];
  const dfs = (): void => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return result;
}
