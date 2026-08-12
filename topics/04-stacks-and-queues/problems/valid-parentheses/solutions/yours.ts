export function isValid(s: string): boolean {
  const bracketsMap: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const bracketsChain: string[] = [];
  for (const char of s) {
    if (char in bracketsMap) {
      bracketsChain.push(char);
    }
    else {
      const lastBracket = bracketsChain.pop();
      if (lastBracket === undefined || char !== bracketsMap[lastBracket]) {
        return false;
      }
    }
  }
  return bracketsChain.length === 0;
}
