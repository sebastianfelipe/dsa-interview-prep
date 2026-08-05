# TypeScript Interview Cheatsheet

## Prefer these APIs

```ts
const freq = new Map<string, number>();
freq.set(k, (freq.get(k) ?? 0) + 1);

const seen = new Set<number>();
seen.add(x);
seen.has(x);

const sorted = [...nums].sort((a, b) => a - b); // numeric sort!
```

## Pitfalls

| Pitfall | Fix |
|---------|-----|
| `[10,2].sort()` → `[10,2]` lexicographic | `(a,b) => a - b` |
| `queue.shift()` in BFS | Use `head` index pointer |
| Object keys coerce to string | Use `Map` |
| Mutating input unexpectedly | Clone or clarify with interviewer |
| `number` overflow (rare on LC) | Mention BigInt only if needed |
| For-of on string gives UTF-16 units | Fine for ASCII problems |

## Common typed signatures

```ts
function twoSum(nums: number[], target: number): number[] {}
function isValid(s: string): boolean {}
function maxDepth(root: TreeNode | null): number {}
function numIslands(grid: string[][]): number {}
```

## Nullability

LeetCode tree/list nodes are `TreeNode | null` / `ListNode | null`. Check early:

```ts
if (!root) return 0;
if (!head?.next) return head;
```
