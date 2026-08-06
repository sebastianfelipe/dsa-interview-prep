import { describe, it, expect } from 'vitest';
import { Trie } from './solution';

describe('Implement Trie', () => {
  it('example', () => {
    const trie = new Trie();
    trie.insert('apple');
    expect(trie.search('apple')).toBe(true);
    expect(trie.search('app')).toBe(false);
    expect(trie.startsWith('app')).toBe(true);
    trie.insert('app');
    expect(trie.search('app')).toBe(true);
  });
});
