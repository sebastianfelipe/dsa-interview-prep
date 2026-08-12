function isSameChar(strs: string[], position: number): boolean {
  return strs.every((str) => str[position] === strs[0][position]);
}

export function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) {
    return '';
  }

  const strLengths = strs.map((item) => item.length);
  const minLength = Math.min(...strLengths);

  const commonPrefixArray: string[] = [];
  for (let position = 0; position < minLength; position++) {
    if (isSameChar(strs, position)) {
      commonPrefixArray.push(strs[0][position]);
    } else {
      break;
    }
  }

  return commonPrefixArray.join('');
}
