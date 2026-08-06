export function isValid(s: string): boolean {
  const stack: string[] = [];
  const pair: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pair[ch]) return false;
    }
  }
  return stack.length === 0;
}
