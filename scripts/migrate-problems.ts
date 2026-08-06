/**
 * Migrates flat problem markdown files into:
 *   topic/problems/<slug>/{meta.json, README.md, solution.ts, solution.test.ts}
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface MetaDef {
  title: string;
  slug: string;
  leetcodeId?: number;
  difficulty: Difficulty;
  tags: string[];
  /** How to rewrite the extracted code into an exported solution */
  exportName?: string;
}

/** Slug (filename without .md) → metadata */
const META: Record<string, MetaDef> = {
  'two-sum': { title: 'Two Sum', slug: 'two-sum', leetcodeId: 1, difficulty: 'Easy', tags: ['hashing', 'array'] },
  'two-sum-ii': { title: 'Two Sum II — Input Array Is Sorted', slug: 'two-sum-ii', leetcodeId: 167, difficulty: 'Medium', tags: ['two-pointers', 'array'] },
  'longest-substring-without-repeating': {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    leetcodeId: 3,
    difficulty: 'Medium',
    tags: ['sliding-window', 'string'],
  },
  'subarray-sum-equals-k': { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', leetcodeId: 560, difficulty: 'Medium', tags: ['prefix-sum', 'hashing'] },
  'maximum-subarray': { title: 'Maximum Subarray', slug: 'maximum-subarray', leetcodeId: 53, difficulty: 'Medium', tags: ['kadane', 'array'] },
  'product-except-self': { title: 'Product of Array Except Self', slug: 'product-except-self', leetcodeId: 238, difficulty: 'Medium', tags: ['array', 'prefix'] },
  'group-anagrams': { title: 'Group Anagrams', slug: 'group-anagrams', leetcodeId: 49, difficulty: 'Medium', tags: ['hashing', 'string'] },
  'top-k-frequent': { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', leetcodeId: 347, difficulty: 'Medium', tags: ['hashing', 'heap'] },
  'reverse-list': { title: 'Reverse Linked List', slug: 'reverse-linked-list', leetcodeId: 206, difficulty: 'Easy', tags: ['linked-list'] },
  'linked-list-cycle': { title: 'Linked List Cycle', slug: 'linked-list-cycle', leetcodeId: 141, difficulty: 'Easy', tags: ['linked-list'] },
  'merge-two-sorted-lists': { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', leetcodeId: 21, difficulty: 'Easy', tags: ['linked-list'] },
  'valid-parentheses': { title: 'Valid Parentheses', slug: 'valid-parentheses', leetcodeId: 20, difficulty: 'Easy', tags: ['stack'] },
  'daily-temperatures': { title: 'Daily Temperatures', slug: 'daily-temperatures', leetcodeId: 739, difficulty: 'Medium', tags: ['stack', 'monotonic'] },
  'min-stack': { title: 'Min Stack', slug: 'min-stack', leetcodeId: 155, difficulty: 'Medium', tags: ['stack'] },
  'maximum-depth': { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', leetcodeId: 104, difficulty: 'Easy', tags: ['tree', 'dfs'] },
  'level-order': { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', leetcodeId: 102, difficulty: 'Medium', tags: ['tree', 'bfs'] },
  'validate-bst': { title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', leetcodeId: 98, difficulty: 'Medium', tags: ['tree', 'bst'] },
  'lca-bst': { title: 'Lowest Common Ancestor of a Binary Search Tree', slug: 'lowest-common-ancestor-of-a-binary-search-tree', leetcodeId: 235, difficulty: 'Medium', tags: ['tree', 'bst'] },
  'number-of-islands': { title: 'Number of Islands', slug: 'number-of-islands', leetcodeId: 200, difficulty: 'Medium', tags: ['graph', 'dfs'] },
  'clone-graph': { title: 'Clone Graph', slug: 'clone-graph', leetcodeId: 133, difficulty: 'Medium', tags: ['graph'] },
  'course-schedule': { title: 'Course Schedule', slug: 'course-schedule', leetcodeId: 207, difficulty: 'Medium', tags: ['graph', 'topo'] },
  'kth-largest': { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', leetcodeId: 215, difficulty: 'Medium', tags: ['heap'] },
  'merge-k-sorted-lists': { title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists', leetcodeId: 23, difficulty: 'Hard', tags: ['heap', 'linked-list'] },
  subsets: { title: 'Subsets', slug: 'subsets', leetcodeId: 78, difficulty: 'Medium', tags: ['backtracking'] },
  permutations: { title: 'Permutations', slug: 'permutations', leetcodeId: 46, difficulty: 'Medium', tags: ['backtracking'] },
  'combination-sum': { title: 'Combination Sum', slug: 'combination-sum', leetcodeId: 39, difficulty: 'Medium', tags: ['backtracking'] },
  'word-search': { title: 'Word Search', slug: 'word-search', leetcodeId: 79, difficulty: 'Medium', tags: ['backtracking'] },
  'climbing-stairs': { title: 'Climbing Stairs', slug: 'climbing-stairs', leetcodeId: 70, difficulty: 'Easy', tags: ['dp'] },
  'house-robber': { title: 'House Robber', slug: 'house-robber', leetcodeId: 198, difficulty: 'Medium', tags: ['dp'] },
  'coin-change': { title: 'Coin Change', slug: 'coin-change', leetcodeId: 322, difficulty: 'Medium', tags: ['dp'] },
  'unique-paths': { title: 'Unique Paths', slug: 'unique-paths', leetcodeId: 62, difficulty: 'Medium', tags: ['dp'] },
  'jump-game': { title: 'Jump Game', slug: 'jump-game', leetcodeId: 55, difficulty: 'Medium', tags: ['greedy'] },
  'gas-station': { title: 'Gas Station', slug: 'gas-station', leetcodeId: 134, difficulty: 'Medium', tags: ['greedy'] },
  'search-rotated': { title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', leetcodeId: 33, difficulty: 'Medium', tags: ['binary-search'] },
  'ship-packages': { title: 'Capacity To Ship Packages Within D Days', slug: 'capacity-to-ship-packages-within-d-days', leetcodeId: 1011, difficulty: 'Medium', tags: ['binary-search'] },
  'single-number': { title: 'Single Number', slug: 'single-number', leetcodeId: 136, difficulty: 'Easy', tags: ['bit'] },
  'hamming-weight': { title: 'Number of 1 Bits', slug: 'number-of-1-bits', leetcodeId: 191, difficulty: 'Easy', tags: ['bit'] },
  'rotate-image': { title: 'Rotate Image', slug: 'rotate-image', leetcodeId: 48, difficulty: 'Medium', tags: ['matrix'] },
  'spiral-matrix': { title: 'Spiral Matrix', slug: 'spiral-matrix', leetcodeId: 54, difficulty: 'Medium', tags: ['matrix'] },
  'merge-intervals': { title: 'Merge Intervals', slug: 'merge-intervals', leetcodeId: 56, difficulty: 'Medium', tags: ['intervals'] },
  'meeting-rooms-ii': { title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', leetcodeId: 253, difficulty: 'Medium', tags: ['intervals'] },
  'implement-trie': { title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', leetcodeId: 208, difficulty: 'Medium', tags: ['trie'] },
};

function extractTs(md: string): string {
  const blocks: string[] = [];
  const re = /```(?:ts|typescript)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) blocks.push(m[1]!.trim());
  if (!blocks.length) throw new Error('No ts fence found');
  // Prefer the largest / first complete-looking block
  return blocks.sort((a, b) => b.length - a.length)[0]!;
}

function stripCodeSections(md: string): string {
  let out = md.replace(/## Code[\s\S]*?(?=\n## |\n# |$)/g, '');
  out = out.replace(/## Approach B[\s\S]*?(?=\n## |\n# |$)/g, (section) => {
    // Keep approach text but drop fences
    return section.replace(/```[\s\S]*?```/g, '');
  });
  out = out.replace(/```(?:ts|typescript)\n[\s\S]*?```/g, '');
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function ensureExports(code: string): string {
  let c = code;
  // Export top-level functions/classes that aren't already exported
  c = c.replace(/^(async\s+)?function\s+(\w+)/gm, (full, asyncPart, name) => {
    if (c.includes(`export ${full}`) || c.includes(`export function ${name}`) || c.includes(`export async function ${name}`)) {
      return full;
    }
    return `${asyncPart ?? ''}export function ${name}`;
  });
  // Fix double "export export"
  c = c.replace(/export\s+export\s+/g, 'export ');
  c = c.replace(/^(export\s+)?class\s+(\w+)/gm, (_full, _exp, name) => `export class ${name}`);
  c = c.replace(/export\s+export\s+class/g, 'export class');

  // Common helper types referenced but not defined
  if (/\bListNode\b/.test(c) && !/class ListNode/.test(c) && !/from ['"]@lib\/helpers/.test(c)) {
    c = `import { ListNode } from '@lib/helpers';\n\n` + c;
  }
  if (/\bTreeNode\b/.test(c) && !/class TreeNode/.test(c) && !/from ['"]@lib\/helpers/.test(c)) {
    c = `import { TreeNode } from '@lib/helpers';\n\n` + c;
  }
  if (/\bNode\b/.test(c) && /neighbors/.test(c) && !/class Node/.test(c) && !/from ['"]@lib\/helpers/.test(c)) {
    c = `import { Node } from '@lib/helpers';\n\n` + c;
  }

  return c.trim() + '\n';
}

function defaultTest(meta: MetaDef, code: string): string {
  // Infer primary export
  const fn = code.match(/export function (\w+)/)?.[1];
  const cls = code.match(/export class (\w+)/)?.[1];

  if (cls) {
    return `import { describe, it, expect } from 'vitest';
import { ${cls} } from './solution';

describe('${meta.title}', () => {
  it('constructs', () => {
    const obj = new ${cls}(${cls === 'MinStack' ? '' : cls === 'Trie' ? '' : ''});
    expect(obj).toBeDefined();
  });
});
`;
  }

  const name = fn ?? 'solve';
  return `import { describe, it, expect } from 'vitest';
import { ${name} } from './solution';

describe('${meta.title}', () => {
  it('is defined', () => {
    expect(${name}).toBeTypeOf('function');
  });
});
`;
}

/** Hand-written better tests keyed by file slug (pre-migration name) */
const CUSTOM_TESTS: Record<string, string> = {
  'two-sum': `import { describe, it, expect } from 'vitest';
import { twoSum } from './solution';

describe('Two Sum', () => {
  it('example 1', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });
  it('example 2', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });
});
`,
  'climbing-stairs': `import { describe, it, expect } from 'vitest';
import { climbStairs } from './solution';

describe('Climbing Stairs', () => {
  it('n=2', () => expect(climbStairs(2)).toBe(2));
  it('n=3', () => expect(climbStairs(3)).toBe(3));
  it('n=5', () => expect(climbStairs(5)).toBe(8));
});
`,
  'valid-parentheses': `import { describe, it, expect } from 'vitest';
import { isValid } from './solution';

describe('Valid Parentheses', () => {
  it('valid', () => expect(isValid('()[]{}')).toBe(true));
  it('invalid', () => expect(isValid('(]')).toBe(false));
});
`,
  'two-sum-ii': `import { describe, it, expect } from 'vitest';
import { twoSum } from './solution';

describe('Two Sum II', () => {
  it('example', () => expect(twoSum([2, 7, 11, 15], 9)).toEqual([1, 2]));
});
`,
  'longest-substring-without-repeating': `import { describe, it, expect } from 'vitest';
import { lengthOfLongestSubstring } from './solution';

describe('Longest Substring Without Repeating', () => {
  it('abcabcbb', () => expect(lengthOfLongestSubstring('abcabcbb')).toBe(3));
  it('bbbbb', () => expect(lengthOfLongestSubstring('bbbbb')).toBe(1));
});
`,
};

function migrateFile(mdPath: string) {
  const topic = path.basename(path.dirname(path.dirname(mdPath)));
  const fileSlug = path.basename(mdPath, '.md');
  const meta = META[fileSlug];
  if (!meta) {
    console.warn('No meta for', fileSlug);
    return;
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const rawCode = extractTs(md);
  const code = ensureExports(rawCode);
  const readme = stripCodeSections(md);
  // Fix title if slug renamed
  const titled = readme.replace(/^# .+$/m, `# ${meta.title}`);

  const outDir = path.join(ROOT, topic, 'problems', meta.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(
      {
        title: meta.title,
        slug: meta.slug,
        leetcodeId: meta.leetcodeId,
        difficulty: meta.difficulty,
        tags: meta.tags,
      },
      null,
      2,
    ) + '\n',
  );
  fs.writeFileSync(path.join(outDir, 'README.md'), titled.endsWith('\n') ? titled : titled + '\n');
  fs.writeFileSync(path.join(outDir, 'solution.ts'), code);
  const test = CUSTOM_TESTS[fileSlug] ?? defaultTest(meta, code);
  fs.writeFileSync(path.join(outDir, 'solution.test.ts'), test);

  // Remove old flat file
  fs.unlinkSync(mdPath);
  console.log('Migrated', topic, meta.slug);
}

function main() {
  const topics = fs.readdirSync(ROOT).filter((d) => /^\d{2}-/.test(d));
  for (const topic of topics) {
    const problemsDir = path.join(ROOT, topic, 'problems');
    if (!fs.existsSync(problemsDir)) continue;
    for (const file of fs.readdirSync(problemsDir)) {
      if (!file.endsWith('.md')) continue;
      migrateFile(path.join(problemsDir, file));
    }
  }
}

main();
