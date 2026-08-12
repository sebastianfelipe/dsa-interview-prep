export function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const word of strs) {
    const key = [...word].sort().join("");
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(word);
    }
    else {
      groups.set(key, [word]);
    }
  }
  return [...groups.values()];
}
/** Faster key for lowercase a-z */
export function anagramKey(word: string): string {
  const counts = new Array<number>(26).fill(0);
  for (const ch of word) {
    counts[ch.charCodeAt(0) - 97] += 1;
  }
  return counts.join("#");
}
