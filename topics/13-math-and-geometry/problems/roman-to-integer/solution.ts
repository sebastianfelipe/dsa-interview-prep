const ROMAN: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export function romanToInt(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = ROMAN[s[i]];
    const next = i + 1 < s.length ? ROMAN[s[i + 1]] : 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}
