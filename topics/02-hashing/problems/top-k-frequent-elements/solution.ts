export function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, f] of freq) buckets[f].push(val);

  const result: number[] = [];
  for (let f = buckets.length - 1; f >= 0 && result.length < k; f--) {
    for (const val of buckets[f]) {
      result.push(val);
      if (result.length === k) return result;
    }
  }
  return result;
}
