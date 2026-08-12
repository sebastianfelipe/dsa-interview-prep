export function lengthOfLastWord(s: string): number {
  const words = s.split(' ');
  const lastWord = words.findLast((word) => word.length > 0);
  return lastWord?.length ? lastWord.length : 0;
}
