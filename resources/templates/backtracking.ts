/** Subsets — include / exclude each element. */
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

/** Permutations — swap / used-array style. */
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
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]!);
      dfs();
      path.pop();
      used[i] = false;
    }
  };

  dfs();
  return result;
}

/**
 * Template mental model:
 * 1. Choose / decide at position i
 * 2. Recurse
 * 3. Undo (backtrack)
 * 4. Prune when partial path cannot lead to a valid answer
 */
