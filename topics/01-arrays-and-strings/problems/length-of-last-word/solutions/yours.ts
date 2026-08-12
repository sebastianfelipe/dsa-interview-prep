export function lengthOfLastWord(s: string): number {
  const words = s.split(' ');
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    if (word && word.length > 0) {
      return word.length;
    }
  }
  return 0;
}
