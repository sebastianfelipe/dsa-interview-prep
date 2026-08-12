export function shoppingOffers(price: number[], special: number[][], needs: number[]): number {
  const memo = new Map<string, number>();
  function dfs(remain: number[]): number {
    const key = remain.join(',');
    const cached = memo.get(key);
    if (cached !== undefined) {
      return cached;
    }
    let best = 0;
    for (let i = 0; i < remain.length; i++) {
      best += remain[i] * price[i];
    }
    for (const offer of special) {
      const next = remain.slice();
      let ok = true;
      for (let i = 0; i < remain.length; i++) {
        if (offer[i] > next[i]) {
          ok = false;
          break;
        }
        next[i] -= offer[i];
      }
      if (!ok) {
        continue;
      }
      best = Math.min(best, offer[remain.length] + dfs(next));
    }
    memo.set(key, best);
    return best;
  }
  return dfs(needs);
}
