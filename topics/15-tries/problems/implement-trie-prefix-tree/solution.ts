class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

export class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.walk(word);
    return node?.isEnd === true;
  }

  startsWith(prefix: string): boolean {
    return this.walk(prefix) != null;
  }

  private walk(s: string): TrieNode | null {
    let node = this.root;
    for (const ch of s) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}
