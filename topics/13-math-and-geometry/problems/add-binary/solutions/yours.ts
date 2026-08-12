export function addBinary(a: string, b: string): string {
  const result: number[] = [];
  const maxLength = Math.max(a.length, b.length);
  for (let offset = 0; offset < maxLength; offset++) {
    if (result[result.length - offset - 1] === undefined) {
      result.unshift(0);
    }
    const aDigit = parseInt(a[a.length - offset - 1] || '0', 10);
    const bDigit = parseInt(b[b.length - offset - 1] || '0', 10);
    const sum = aDigit + bDigit + result[result.length - offset - 1];
    result[result.length - offset - 1] = sum % 2;
    if (sum > 1) {
      result.unshift(1);
    }
  }
  return result.join('');
}
