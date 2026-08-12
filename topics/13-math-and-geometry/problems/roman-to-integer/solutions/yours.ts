export function romanToInt(s: string): number {
  const symbolsMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const symbol = s[i];
    switch (symbol) {
      case 'I': {
        if (s[i + 1] === 'V') {
          sum += 4;
          i++;
          break;
        }
        if (s[i + 1] === 'X') {
          sum += 9;
          i++;
          break;
        }
        sum += symbolsMap[symbol];
        break;
      }
      case 'X': {
        if (s[i + 1] === 'L') {
          sum += 40;
          i++;
          break;
        }
        if (s[i + 1] === 'C') {
          sum += 90;
          i++;
          break;
        }
        sum += symbolsMap[symbol];
        break;
      }
      case 'C': {
        if (s[i + 1] === 'D') {
          sum += 400;
          i++;
          break;
        }
        if (s[i + 1] === 'M') {
          sum += 900;
          i++;
          break;
        }
        sum += symbolsMap[symbol];
        break;
      }
      default: {
        sum += symbolsMap[symbol];
      }
    }
  }
  return sum;
}
