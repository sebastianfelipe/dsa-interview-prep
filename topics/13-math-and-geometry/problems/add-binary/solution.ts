export function addBinary(a: string, b: string): string {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out: string[] = [];
  while (i >= 0 || j >= 0 || carry) {
    const bitA = i >= 0 ? Number(a[i--]) : 0;
    const bitB = j >= 0 ? Number(b[j--]) : 0;
    const sum = bitA + bitB + carry;
    out.push(String(sum % 2));
    carry = sum >> 1;
  }
  return out.reverse().join('');
}
