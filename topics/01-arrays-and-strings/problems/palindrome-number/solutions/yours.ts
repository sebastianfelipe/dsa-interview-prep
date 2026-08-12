export function isPalindrome(x: number): boolean {
  const xStr = x.toString();
  const reversedXStr = xStr.split('').reverse().join('');
  return xStr === reversedXStr;
}
