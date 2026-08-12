/**
 * Add ## Examples to every problem README and example walkthroughs to solutions.
 * Run: node scripts/add-problem-examples.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** @type {Record<string, { examples: string, walkthroughs?: Record<string, string>, recommended?: { title: string, notes: string, time: string, space: string, approach: string } }>} */
const DATA = {
  'two-sum': {
    examples: `### Example 1
**Input:** \`nums = [2, 7, 11, 15]\`, \`target = 9\`
**Output:** \`[0, 1]\`
**Explanation:** \`nums[0] + nums[1] = 2 + 7 = 9\`, so the indices are \`0\` and \`1\`.

### Example 2
**Input:** \`nums = [3, 2, 4]\`, \`target = 6\`
**Output:** \`[1, 2]\`
**Explanation:** \`2 + 4 = 6\`.`,
    walkthroughs: {
      recommended: `Take \`[2, 7, 11, 15]\` with target \`9\`. At \`2\`, remember index \`0\` and look for \`7\`. At \`7\`, the map already has \`2\`, so return \`[0, 1]\`.`,
      yours: `Try pairs in order: \`2+7=9\` immediately, so return \`[0, 1]\` without checking further pairs.`,
    },
  },
  'palindrome-number': {
    examples: `### Example 1
**Input:** \`x = 121\`
**Output:** \`true\`
**Explanation:** Reading left-to-right or right-to-left gives \`121\`.

### Example 2
**Input:** \`x = -121\`
**Output:** \`false\`
**Explanation:** From the left it is \`-121\`; from the right it would be \`121-\`.`,
    walkthroughs: {
      recommended: `For \`121\`, peel digits from the end to build \`121\` reversed (or half of it) and compare to the original — they match.`,
      yours: `Turn \`121\` into \`"121"\`, reverse the characters to \`"121"\`, and see the strings are equal.`,
    },
  },
  'roman-to-integer': {
    examples: `### Example 1
**Input:** \`s = "III"\`
**Output:** \`3\`
**Explanation:** \`I + I + I = 3\`.

### Example 2
**Input:** \`s = "MCMXCIV"\`
**Output:** \`1994\`
**Explanation:** \`M = 1000\`, \`CM = 900\`, \`XC = 90\`, \`IV = 4\`.`,
    walkthroughs: {
      recommended: `Scan \`"MCMXCIV"\` right-to-left. When a smaller value sits before a larger one (like \`C\` before \`M\`), subtract it; otherwise add. You get \`1000 - 100 + 1000 - 10 + 100 - 1 + 5 = 1994\`.`,
      yours: `Walk left-to-right and special-case pairs: \`CM\` → \`900\`, \`XC\` → \`90\`, \`IV\` → \`4\`, plus \`M\` → \`1000\`, totaling \`1994\`.`,
    },
  },
  'longest-common-prefix': {
    examples: `### Example 1
**Input:** \`strs = ["flower", "flow", "flight"]\`
**Output:** \`"fl"\`
**Explanation:** The shared start of every word is \`"fl"\`.

### Example 2
**Input:** \`strs = ["dog", "racecar", "car"]\`
**Output:** \`""\`
**Explanation:** There is no character shared at the start of all three.`,
    walkthroughs: {
      recommended: `Start with \`"flower"\`. \`"flow"\` does not start with \`"flower"\`, so shrink to \`"flow"\`. \`"flight"\` needs shrinking to \`"fl"\`. That prefix fits all three.`,
      yours: `Shortest length is \`4\` (\`"flow"\`). Position \`0\` is \`f\` in all; position \`1\` is \`l\` in all; position \`2\` differs (\`o\` vs \`i\`), so stop and join \`"fl"\`.`,
    },
  },
  'valid-parentheses': {
    examples: `### Example 1
**Input:** \`s = "()"\`
**Output:** \`true\`

### Example 2
**Input:** \`s = "(]"\`
**Output:** \`false\`
**Explanation:** The closer \`] \` does not match the opener \`(\`.`,
    walkthroughs: {
      recommended: `On \`"()"\`, push \`(\`. On \`)\`, pop and confirm it matches. Stack ends empty → valid.`,
      yours: `Same stack idea: push openings from a map; when you see a closer, pop and check it maps to that closer.`,
    },
  },
  'merge-two-sorted-lists': {
    examples: `### Example 1
**Input:** \`list1 = [1, 2, 4]\`, \`list2 = [1, 3, 4]\`
**Output:** \`[1, 1, 2, 3, 4, 4]\`
**Explanation:** Merge while keeping non-decreasing order.`,
    walkthroughs: {
      recommended: `Dummy head walks both lists: take \`1\` from list1, \`1\` from list2, \`2\`, \`3\`, \`4\`, \`4\`, always attaching the smaller current node.`,
      yours: `Recursively pick the smaller head (\`1\` vs \`1\`), then merge the remainders the same way until one list is empty.`,
    },
  },
  'remove-duplicates-from-sorted-array': {
    examples: `### Example 1
**Input:** \`nums = [1, 1, 2]\`
**Output:** \`2\`, with \`nums\` beginning \`[1, 2, _]\`
**Explanation:** Keep unique values in-place; length of the unique prefix is \`2\`.`,
    walkthroughs: {
      recommended: `Write pointer stays on the last unique. Read finds \`2\` different from \`1\`, writes it next, and returns write+1 = \`2\`.`,
      yours: `When you see a duplicate next to the previous value, \`splice\` it out; after removing the second \`1\`, the array is \`[1, 2]\`.`,
    },
  },
  'remove-element': {
    examples: `### Example 1
**Input:** \`nums = [3, 2, 2, 3]\`, \`val = 3\`
**Output:** \`2\`, with \`nums\` beginning \`[2, 2, _, _]\`
**Explanation:** Remove every \`3\` in-place; keep order of the rest as you like.`,
    walkthroughs: {
      recommended: `Copy every non-\`3\` forward: write \`2\`, then another \`2\`, return write count \`2\`.`,
      yours: `Whenever \`nums[i] === 3\`, \`splice\` that index out and stay; you end with \`[2, 2]\`.`,
    },
  },
  'find-the-index-of-the-first-occurrence-in-a-string': {
    examples: `### Example 1
**Input:** \`haystack = "sadbutsad"\`, \`needle = "sad"\`
**Output:** \`0\`
**Explanation:** \`"sad"\` appears first at index \`0\`.

### Example 2
**Input:** \`haystack = "leetcode"\`, \`needle = "leeto"\`
**Output:** \`-1\`
**Explanation:** \`"leeto"\` is not a substring.`,
    walkthroughs: {
      recommended: `Slide a window of length \`3\` over \`"sadbutsad"\`. The slice at \`0\` equals \`"sad"\`, so return \`0\`.`,
      yours: `Delegate to \`haystack.indexOf("sad")\`, which returns \`0\`.`,
    },
  },
  'search-insert-position': {
    examples: `### Example 1
**Input:** \`nums = [1, 3, 5, 6]\`, \`target = 5\`
**Output:** \`2\`

### Example 2
**Input:** \`nums = [1, 3, 5, 6]\`, \`target = 2\`
**Output:** \`1\`
**Explanation:** \`2\` belongs between \`1\` and \`3\`.`,
    walkthroughs: {
      recommended: `Binary search for \`2\` in \`[1, 3, 5, 6]\`. The search ends with \`lo = 1\`, the insert index.`,
      yours: `\`findIndex\` finds the first value \`>= 2\`, which is \`3\` at index \`1\`.`,
    },
  },
  'length-of-last-word': {
    examples: `### Example 1
**Input:** \`s = "Hello World"\`
**Output:** \`5\`
**Explanation:** The last word is \`"World"\` with length \`5\`.

### Example 2
**Input:** \`s = "   fly me   to   the moon  "\`
**Output:** \`4\`
**Explanation:** Ignore trailing spaces; last word is \`"moon"\`.`,
    walkthroughs: {
      recommended: `Skip spaces from the end of \`"Hello World"\`, then count letters of \`"World"\` → \`5\`.`,
      yours: `Split on spaces and take the last non-empty token \`"World"\`.length → \`5\`.`,
    },
  },
  'plus-one': {
    examples: `### Example 1
**Input:** \`digits = [1, 2, 3]\`
**Output:** \`[1, 2, 4]\`
**Explanation:** The number \`123\` plus one is \`124\`.

### Example 2
**Input:** \`digits = [9, 9]\`
**Output:** \`[1, 0, 0]\`
**Explanation:** \`99 + 1 = 100\`.`,
    walkthroughs: {
      recommended: `From the right of \`[1,2,3]\`, \`3 < 9\`, so bump to \`4\` and stop → \`[1,2,4]\`. For \`[9,9]\`, both become \`0\` and you prepend \`1\`.`,
      yours: `Same right-to-left carry: increment or set \`0\` and continue; \`unshift(1)\` if you overflow the leading digit.`,
    },
  },
  'add-binary': {
    examples: `### Example 1
**Input:** \`a = "11"\`, \`b = "1"\`
**Output:** \`"100"\`
**Explanation:** \`3 + 1 = 4\` in binary.

### Example 2
**Input:** \`a = "1010"\`, \`b = "1011"\`
**Output:** \`"10101"\`.`,
    walkthroughs: {
      recommended: `Add from the right with a carry: \`1+1\` → write \`0\` carry \`1\`, then \`1+carry\` → write \`0\` carry \`1\`, finally leftover carry → \`"100"\`.`,
      yours: `Same digit-wise sum into a result array, writing \`sum % 2\` and carrying with \`unshift\` when needed.`,
    },
  },
  'sqrtx': {
    examples: `### Example 1
**Input:** \`x = 4\`
**Output:** \`2\`

### Example 2
**Input:** \`x = 8\`
**Output:** \`2\`
**Explanation:** \`√8 ≈ 2.82\`, so the floored integer square root is \`2\`.`,
    walkthroughs: {
      recommended: `Binary search mid in \`[0, 8]\`. When \`mid*mid <= 8\` keep mid as answer and search right; eventually answer settles at \`2\`.`,
      yours: `Guess the midpoint, compare \`guess²\` to \`8\`, and tighten bounds until the floor root \`2\` is found.`,
    },
  },
  'climbing-stairs': {
    examples: `### Example 1
**Input:** \`n = 2\`
**Output:** \`2\`
**Explanation:** \`1+1\` or \`2\`.

### Example 2
**Input:** \`n = 3\`
**Output:** \`3\`
**Explanation:** \`1+1+1\`, \`1+2\`, \`2+1\`.`,
    walkthroughs: {
      recommended: `Ways(\`3\`) = ways(\`2\`) + ways(\`1\`) = \`2 + 1 = 3\`, computed bottom-up with two rolling variables.`,
      yours: `Same Fibonacci recurrence with memo: \`climb(3)\` caches \`climb(2)+climb(1)\`.`,
    },
  },
  'remove-duplicates-from-sorted-list': {
    examples: `### Example 1
**Input:** \`head = [1, 1, 2]\`
**Output:** \`[1, 2]\`

### Example 2
**Input:** \`head = [1, 1, 2, 3, 3]\`
**Output:** \`[1, 2, 3]\`.`,
    walkthroughs: {
      recommended: `At the first \`1\`, next is also \`1\`, so skip the next node. Move on when values differ → \`[1, 2]\`.`,
      yours: `Same unlink: while \`current.val === current.next.val\`, set \`current.next = current.next.next\`.`,
    },
  },
  'merge-sorted-array': {
    examples: `### Example 1
**Input:** \`nums1 = [1, 2, 3, 0, 0, 0]\`, \`m = 3\`, \`nums2 = [2, 5, 6]\`, \`n = 3\`
**Output:** \`[1, 2, 2, 3, 5, 6]\`
**Explanation:** Merge into \`nums1\` in sorted order.`,
    walkthroughs: {
      recommended: `Fill from the back: compare \`3\` and \`6\`, place \`6\`; then \`5\`; then \`3\` vs \`2\`, and so on until \`nums1\` is fully sorted.`,
      yours: `Walk forward and \`splice\` values from \`nums2\` into the right spot in \`nums1\`, popping the trailing unused slots.`,
    },
  },
  'binary-tree-inorder-traversal': {
    examples: `### Example 1
**Input:** \`root = [1, null, 2, 3]\`
**Output:** \`[1, 3, 2]\`
**Explanation:** Inorder is left → node → right.`,
    walkthroughs: {
      recommended: `Visit left of \`1\` (none), emit \`1\`, go right to \`2\`, visit its left \`3\`, emit \`3\`, then emit \`2\`.`,
      yours: `Same recursive inorder into a shared array: left subtree, push node, right subtree.`,
    },
  },
  'same-tree': {
    examples: `### Example 1
**Input:** \`p = [1, 2, 3]\`, \`q = [1, 2, 3]\`
**Output:** \`true\`

### Example 2
**Input:** \`p = [1, 2]\`, \`q = [1, null, 2]\`
**Output:** \`false\`
**Explanation:** Structure differs (left child vs right child).`,
    walkthroughs: {
      recommended: `Both roots are \`1\`. Recurse left (\`2\` vs \`2\`) and right (\`3\` vs \`3\`). All match → \`true\`.`,
      yours: `Same structural recursion: equal values and both subtrees pairwise equal.`,
    },
  },
  'symmetric-tree': {
    examples: `### Example 1
**Input:** \`root = [1, 2, 2, 3, 4, 4, 3]\`
**Output:** \`true\`
**Explanation:** The tree is a mirror around the center.

### Example 2
**Input:** \`root = [1, 2, 2, null, 3, null, 3]\`
**Output:** \`false\`.`,
    walkthroughs: {
      recommended: `Compare left and right subtrees as mirrors: outer children together, inner children together, values equal at each step.`,
      yours: `Helper \`validateLeftAndRight\` mirrors left.left↔right.right and left.right↔right.left.`,
    },
  },
  // --- problems without solutions.json yet (README examples + recommended catalog) ---
  'two-sum-ii': {
    examples: `### Example 1
**Input:** \`numbers = [2, 7, 11, 15]\`, \`target = 9\`
**Output:** \`[1, 2]\`
**Explanation:** 1-indexed indices of \`2\` and \`7\`.`,
    recommended: {
      title: 'Two pointers on sorted array',
      notes: 'Move left/right based on sum vs target',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'Because the array is sorted, start at both ends and move the pointer that fixes an undershoot or overshoot.',
    },
    walkthroughs: {
      recommended: `Left \`2\`, right \`15\` sum too big → move right. Eventually \`2+7=9\` → return 1-based \`[1, 2]\`.`,
    },
  },
  'longest-substring-without-repeating-characters': {
    examples: `### Example 1
**Input:** \`s = "abcabcbb"\`
**Output:** \`3\`
**Explanation:** \`"abc"\` is a longest substring without repeats.

### Example 2
**Input:** \`s = "bbbbb"\`
**Output:** \`1\`.`,
    recommended: {
      title: 'Sliding window + last-seen index',
      notes: 'Shrink left when a repeat enters the window',
      time: 'O(n)',
      space: 'O(min(n, alphabet))',
      approach: 'Grow a window with a map of last indices; when a character repeats inside the window, jump left past its previous index.',
    },
    walkthroughs: {
      recommended: `In \`"abcabcbb"\`, the window grows \`a-b-c\`, then the second \`a\` forces left forward; best length stays \`3\`.`,
    },
  },
  'maximum-subarray': {
    examples: `### Example 1
**Input:** \`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\`
**Output:** \`6\`
**Explanation:** Subarray \`[4, -1, 2, 1]\` sums to \`6\`.`,
    recommended: {
      title: 'Kadane’s algorithm',
      notes: 'Track best ending-here vs global best',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'At each index, either extend the previous run or start fresh at the current value; keep the maximum seen.',
    },
    walkthroughs: {
      recommended: `When you reach \`4\`, starting fresh beats carrying negatives. Then \`-1, 2, 1\` extend to sum \`6\`, the best.`,
    },
  },
  'product-except-self': {
    examples: `### Example 1
**Input:** \`nums = [1, 2, 3, 4]\`
**Output:** \`[24, 12, 8, 6]\`
**Explanation:** Each index gets the product of all other values (no division).`,
    recommended: {
      title: 'Prefix and suffix products',
      notes: 'Two passes, O(1) extra besides output',
      time: 'O(n)',
      space: 'O(1) extra',
      approach: 'Fill left-products, then multiply running right-products while scanning from the end.',
    },
    walkthroughs: {
      recommended: `Left pass puts \`[1,1,2,6]\`. Right pass multiplies \`4,3,2,1\` style factors to get \`[24,12,8,6]\`.`,
    },
  },
  'subarray-sum-equals-k': {
    examples: `### Example 1
**Input:** \`nums = [1, 1, 1]\`, \`k = 2\`
**Output:** \`2\`
**Explanation:** Subarrays \`[1, 1]\` (indices 0–1) and \`[1, 1]\` (indices 1–2).`,
    recommended: {
      title: 'Prefix sums + hash map',
      notes: 'Count prior prefixes equal to sum - k',
      time: 'O(n)',
      space: 'O(n)',
      approach: 'As the running sum grows, add how many earlier prefixes equal \`sum - k\`.',
    },
    walkthroughs: {
      recommended: `After two \`1\`s, sum is \`2\`; a prior prefix \`0\` means one subarray. After three \`1\`s, another hit for total \`2\`.`,
    },
  },
  'group-anagrams': {
    examples: `### Example 1
**Input:** \`strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\`
**Output:** \`[["bat"],["nat","tan"],["ate","eat","tea"]]\`
**Explanation:** Anagrams share the same letter multiset.`,
    recommended: {
      title: 'Hash by sorted key / count signature',
      notes: 'Group strings that scramble to the same key',
      time: 'O(n · k log k) sorted key',
      space: 'O(n · k)',
      approach: 'Map each word to a canonical key (sorted chars or 26-count), then bucket words by that key.',
    },
    walkthroughs: {
      recommended: `"eat", "tea", "ate" all key to "aet" and land in one bucket; "tan"/"nat" share another.`,
    },
  },
  'top-k-frequent-elements': {
    examples: `### Example 1
**Input:** \`nums = [1, 1, 1, 2, 2, 3]\`, \`k = 2\`
**Output:** \`[1, 2]\`
**Explanation:** \`1\` appears thrice, \`2\` twice.`,
    recommended: {
      title: 'Frequency map + bucket / heap',
      notes: 'Count then pick the k densest values',
      time: 'O(n)',
      space: 'O(n)',
      approach: 'Count frequencies, then use buckets (or a heap) to collect the k most common values.',
    },
    walkthroughs: {
      recommended: `Counts: \`1→3\`, \`2→2\`, \`3→1\`. Buckets by frequency yield \`1\` then \`2\` for \`k = 2\`.`,
    },
  },
  'reverse-linked-list': {
    examples: `### Example 1
**Input:** \`head = [1, 2, 3, 4, 5]\`
**Output:** \`[5, 4, 3, 2, 1]\`.`,
    recommended: {
      title: 'Iterative pointer reverse',
      notes: 'prev / curr / next dance',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'Walk the list once, reversing \`next\` to point backward while advancing.',
    },
    walkthroughs: {
      recommended: `\`1→2\` becomes \`1←2\`, then fold in \`3\`, and so on until \`5\` is the new head.`,
    },
  },
  'linked-list-cycle': {
    examples: `### Example 1
**Input:** \`head = [3, 2, 0, -4]\` with a cycle at index \`1\`
**Output:** \`true\`
**Explanation:** Tail connects back to node \`2\`.`,
    recommended: {
      title: 'Floyd slow/fast pointers',
      notes: 'Fast catches slow iff a cycle exists',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'Advance one pointer by 1 and another by 2; meeting means a loop.',
    },
    walkthroughs: {
      recommended: `Slow and fast start at \`3\`. Fast laps inside the cycle and eventually lands on the same node as slow → \`true\`.`,
    },
  },
  'min-stack': {
    examples: `### Example
**Operations:** \`push(-2)\`, \`push(0)\`, \`push(-3)\`, \`getMin()\`, \`pop()\`, \`top()\`, \`getMin()\`
**Outputs:** \`getMin → -3\`, \`top → 0\`, \`getMin → -2\`.`,
    recommended: {
      title: 'Parallel mins stack',
      notes: 'Store running minimum with each push',
      time: 'O(1) ops',
      space: 'O(n)',
      approach: 'Keep a second stack of minima so \`getMin\` is just a peek.',
    },
    walkthroughs: {
      recommended: `After pushes, mins track \`-2\`, then \`-2\`, then \`-3\`. Pop removes \`-3\`; min falls back to \`-2\`.`,
    },
  },
  'lru-cache': {
    examples: `### Example
**Capacity 2:** \`put(1,1)\`, \`put(2,2)\`, \`get(1) → 1\`, \`put(3,3)\` evicts key \`2\`, \`get(2) → -1\`.`,
    recommended: {
      title: 'Hash map + doubly linked list',
      notes: 'O(1) get/put with move-to-front',
      time: 'O(1)',
      space: 'O(capacity)',
      approach: 'Map key→node; on access move node to head; on overflow remove the tail.',
    },
    walkthroughs: {
      recommended: `\`get(1)\` refreshes \`1\` as most recent, so inserting \`3\` drops the least-recent \`2\`.`,
    },
  },
  'daily-temperatures': {
    examples: `### Example 1
**Input:** \`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\`
**Output:** \`[1, 1, 4, 2, 1, 1, 0, 0]\`
**Explanation:** Days until a warmer temperature for each index.`,
    recommended: {
      title: 'Monotonic decreasing stack',
      notes: 'Indices waiting for a warmer day',
      time: 'O(n)',
      space: 'O(n)',
      approach: 'Keep indices of unresolved cooler days; when a warmer day arrives, resolve them.',
    },
    walkthroughs: {
      recommended: `\`74\` resolves \`73\` with distance \`1\`. Later \`76\` resolves several waiting cooler days at once.`,
    },
  },
  'maximum-depth-of-binary-tree': {
    examples: `### Example 1
**Input:** \`root = [3, 9, 20, null, null, 15, 7]\`
**Output:** \`3\`.`,
    recommended: {
      title: 'DFS depth',
      notes: '1 + max(left, right)',
      time: 'O(n)',
      space: 'O(h)',
      approach: 'Recurse for subtree depths and take the larger child depth plus one.',
    },
    walkthroughs: {
      recommended: `Left of \`3\` is depth \`1\` (\`9\`). Right goes \`20 → 15/7\` depth \`2\`. Answer \`1 + 2 = 3\`.`,
    },
  },
  'validate-binary-search-tree': {
    examples: `### Example 1
**Input:** \`root = [2, 1, 3]\`
**Output:** \`true\`

### Example 2
**Input:** \`root = [5, 1, 4, null, null, 3, 6]\`
**Output:** \`false\`
**Explanation:** \`4\` is on the right of \`5\` but has a \`3\` left child.`,
    recommended: {
      title: 'DFS with value bounds',
      notes: 'Tighten low/high along the path',
      time: 'O(n)',
      space: 'O(h)',
      approach: 'Each node must lie within an open interval inherited from ancestors.',
    },
    walkthroughs: {
      recommended: `For \`[5,1,4,...]\`, node \`4\` must be \`> 5\`, but \`4 < 5\` → invalid immediately.`,
    },
  },
  'binary-tree-level-order-traversal': {
    examples: `### Example 1
**Input:** \`root = [3, 9, 20, null, null, 15, 7]\`
**Output:** \`[[3], [9, 20], [15, 7]]\`.`,
    recommended: {
      title: 'BFS by queue',
      notes: 'Process level size batches',
      time: 'O(n)',
      space: 'O(n)',
      approach: 'Queue nodes level by level, recording each batch’s values.',
    },
    walkthroughs: {
      recommended: `Start with \`[3]\`. Next queue \`9,20\`. Then \`15,7\`. Emit those three layers.`,
    },
  },
  'binary-search-tree-iterator': {
    examples: `### Example
**Tree** \`[7, 3, 15, null, null, 9, 20]\`
\`next()\` sequence yields \`3, 7, 9, 15, 20\` (inorder).`,
    recommended: {
      title: 'Controlled inorder stack',
      notes: 'Push left spine; next pops and goes right',
      time: 'Amortized O(1) next',
      space: 'O(h)',
      approach: 'Lazy inorder: stack the path to the current minimum, then advance.',
    },
    walkthroughs: {
      recommended: `Initial stack has \`7\` then \`3\`. First \`next\` pops \`3\`. Later pops emit the rest in sorted order.`,
    },
  },
  'lowest-common-ancestor-of-a-binary-search-tree': {
    examples: `### Example 1
**Input:** \`root = [6, 2, 8, 0, 4, 7, 9]\`, \`p = 2\`, \`q = 8\`
**Output:** \`6\`
**Explanation:** \`6\` is the split point between left and right.`,
    recommended: {
      title: 'BST walk toward the split',
      notes: 'Go left/right until p and q diverge',
      time: 'O(h)',
      space: 'O(1)',
      approach: 'While both targets are on one side, move that way; otherwise current node is the LCA.',
    },
    walkthroughs: {
      recommended: `\`2\` is left of \`6\`, \`8\` is right of \`6\`, so \`6\` is already the answer.`,
    },
  },
  'all-possible-full-binary-trees': {
    examples: `### Example 1
**Input:** \`n = 3\`
**Output:** \`[[0, 0, 0]]\`
**Explanation:** One full binary tree with 3 nodes.

### Example 2
**Input:** \`n = 2\`
**Output:** \`[]\`
**Explanation:** Even counts cannot form a full binary tree.`,
    recommended: {
      title: 'DP / memoized split',
      notes: 'Odd n only; try left/right sizes',
      time: 'Catalan-like',
      space: 'Output-sensitive',
      approach: 'For each odd left size, combine every left FBT with every right FBT under a new root.',
    },
    walkthroughs: {
      recommended: `For \`n = 3\`, only split \`1+1\` under a root → a single tree of three nodes.`,
    },
  },
  'find-duplicate-subtrees': {
    examples: `### Example 1
**Input:** \`root = [1, 2, 3, 4, null, 2, 4, null, null, 4]\`
**Output:** \`[[2, 4], [4]]\`
**Explanation:** Those shapes appear more than once.`,
    recommended: {
      title: 'Serialize subtrees + frequency map',
      notes: 'Identical serial strings are duplicates',
      time: 'O(n²) naive strings / better with ids',
      space: 'O(n)',
      approach: 'Postorder stringify each subtree; when a serialization is seen the second time, record that root.',
    },
    walkthroughs: {
      recommended: `Subtree \`"4"\` appears thrice; \`"2,4"\` appears twice — emit those duplicate roots once each.`,
    },
  },
  'number-of-islands': {
    examples: `### Example 1
**Input:** grid of \`1\` land / \`0\` water forming two islands
**Output:** \`2\`
**Explanation:** Flood-fill (DFS/BFS) each unvisited land cell and count starts.`,
    recommended: {
      title: 'DFS/BFS flood fill',
      notes: 'Sink or mark each island once',
      time: 'O(r · c)',
      space: 'O(r · c)',
      approach: 'For every \`1\`, increment the answer and explore all connected land, marking it visited.',
    },
    walkthroughs: {
      recommended: `Find a \`1\`, count \`+1\`, DFS marks the whole island \`0\`. Next untouched \`1\` starts island two.`,
    },
  },
  'clone-graph': {
    examples: `### Example
**Input:** adjacency list \`[[2,4],[1,3],[2,4],[1,3]]\` (node 1 connected to 2 and 4, …)
**Output:** A deep copy with the same connections.`,
    recommended: {
      title: 'DFS/BFS with map old→new',
      notes: 'Clone once per node, then wire neighbors',
      time: 'O(n + e)',
      space: 'O(n)',
      approach: 'Memoize cloned nodes so cycles do not recurse forever; copy edges via the map.',
    },
    walkthroughs: {
      recommended: `Clone node \`1\`, then recursively clone neighbors \`2\` and \`4\`, linking the new nodes the same way.`,
    },
  },
  'course-schedule': {
    examples: `### Example 1
**Input:** \`numCourses = 2\`, \`prerequisites = [[1, 0]]\`
**Output:** \`true\`
**Explanation:** Take course \`0\` then \`1\`.

### Example 2
**Input:** \`numCourses = 2\`, \`prerequisites = [[1, 0], [0, 1]]\`
**Output:** \`false\`
**Explanation:** Cyclic dependency.`,
    recommended: {
      title: 'Topo sort / cycle detect',
      notes: 'Kahn indegrees or DFS colors',
      time: 'O(V + E)',
      space: 'O(V + E)',
      approach: 'Build the graph; if you can order all courses (or DFS finds no back edge), return true.',
    },
    walkthroughs: {
      recommended: `Edge \`0 → 1\`. Queue starts with \`0\` (indegree 0), unlocks \`1\`, both taken → \`true\`. A mutual edge leaves a cycle.`,
    },
  },
  'keys-and-rooms': {
    examples: `### Example 1
**Input:** \`rooms = [[1], [2], [3], []]\`
**Output:** \`true\`
**Explanation:** Keys chain 0→1→2→3 opens every room.

### Example 2
**Input:** \`rooms = [[1, 3], [3, 0, 1], [2], [0]]\`
**Output:** \`false\`
**Explanation:** Room \`2\` is never reachable.`,
    recommended: {
      title: 'DFS/BFS from room 0',
      notes: 'Collect keys as you visit',
      time: 'O(rooms + keys)',
      space: 'O(rooms)',
      approach: 'Start with room 0 visited; follow keys into new rooms until none remain.',
    },
    walkthroughs: {
      recommended: `From \`0\` get key \`1\`, from \`1\` key \`2\`, from \`2\` key \`3\` — all visited → \`true\`.`,
    },
  },
  'snakes-and-ladders': {
    examples: `### Example
On an \`n x n\` board, start at square \`1\` and reach \`n²\` using 1–6 dice rolls, following snakes/ladders. Return the fewest moves (or \`-1\`).`,
    recommended: {
      title: 'BFS on labels 1…n²',
      notes: 'Each roll is an edge; teleport if board says so',
      time: 'O(n²)',
      space: 'O(n²)',
      approach: 'Breadth-first search over board squares; first time you reach the end is shortest.',
    },
    walkthroughs: {
      recommended: `From square \`1\`, try rolls to \`2…7\` (or teleports), queue them with moves+1, and stop when \`n²\` is dequeued.`,
    },
  },
  'kth-largest-element-in-an-array': {
    examples: `### Example 1
**Input:** \`nums = [3, 2, 1, 5, 6, 4]\`, \`k = 2\`
**Output:** \`5\`
**Explanation:** Sorted descending \`[6, 5, …]\`; 2nd is \`5\`.`,
    recommended: {
      title: 'Min-heap of size k / quickselect',
      notes: 'Keep the k largest seen',
      time: 'O(n log k) heap',
      space: 'O(k)',
      approach: 'Push into a size-k min-heap; the root is the kth largest.',
    },
    walkthroughs: {
      recommended: `Heap holds the best two; after processing all, the smaller of \`{5,6}\` is \`5\`.`,
    },
  },
  'merge-k-sorted-lists': {
    examples: `### Example 1
**Input:** \`lists = [[1, 4, 5], [1, 3, 4], [2, 6]]\`
**Output:** \`[1, 1, 2, 3, 4, 4, 5, 6]\`.`,
    recommended: {
      title: 'Min-heap of list heads',
      notes: 'Always attach the smallest current node',
      time: 'O(N log k)',
      space: 'O(k)',
      approach: 'Push each list head into a heap; pop min, push its next, repeat.',
    },
    walkthroughs: {
      recommended: `Heap starts with \`1,1,2\`. Pop a \`1\`, push \`4\`; keep taking the current minimum until empty.`,
    },
  },
  'subsets': {
    examples: `### Example 1
**Input:** \`nums = [1, 2, 3]\`
**Output:** \`[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\`
**Explanation:** All subsets of the set.`,
    recommended: {
      title: 'Backtracking include/exclude',
      notes: 'At each index choose yes/no',
      time: 'O(n · 2ⁿ)',
      space: 'O(n)',
      approach: 'DFS with a path; either take \`nums[i]\` or skip it, record every path.',
    },
    walkthroughs: {
      recommended: `From \`[]\`, branch on \`1\`, then \`2\`, then \`3\`, snapshotting the path at every leaf → all 8 subsets.`,
    },
  },
  'permutations': {
    examples: `### Example 1
**Input:** \`nums = [1, 2, 3]\`
**Output:** all orderings like \`[1,2,3]\`, \`[1,3,2]\`, …`,
    recommended: {
      title: 'Backtracking with used flags',
      notes: 'Build permutations position by position',
      time: 'O(n · n!)',
      space: 'O(n)',
      approach: 'Try each unused number for the next slot until the path length is n.',
    },
    walkthroughs: {
      recommended: `First slot pick \`1\`, second \`2\`, third \`3\` → one perm; backtrack and swap choices to get the rest.`,
    },
  },
  'combination-sum': {
    examples: `### Example 1
**Input:** \`candidates = [2, 3, 6, 7]\`, \`target = 7\`
**Output:** \`[[2, 2, 3], [7]]\`
**Explanation:** Combinations that sum to \`7\` (reuse allowed).`,
    recommended: {
      title: 'Backtracking with reuse',
      notes: 'Stay on index to reuse a value',
      time: 'Exponential',
      space: 'O(target)',
      approach: 'Subtract a chosen candidate and recurse; move index forward to avoid duplicate combos.',
    },
    walkthroughs: {
      recommended: `Pick \`2\` thrice then need \`1\` — fail; pick \`2,2,3\` hits \`7\`. Separately picking \`7\` is the other combo.`,
    },
  },
  'word-search': {
    examples: `### Example 1
**Board:** \`[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\`, \`word = "ABCCED"\`
**Output:** \`true\`.`,
    recommended: {
      title: 'DFS on grid with backtracking',
      notes: 'Mark visited cells, then undo',
      time: 'O(r · c · 4ᴸ)',
      space: 'O(L)',
      approach: 'From each start cell matching word[0], search neighbors for the next letters.',
    },
    walkthroughs: {
      recommended: `Start at \`A\`, step to \`B\`, \`C\`, down to \`C\`, \`E\`, \`D\` spelling \`ABCCED\` without reusing a cell.`,
    },
  },
  'house-robber': {
    examples: `### Example 1
**Input:** \`nums = [1, 2, 3, 1]\`
**Output:** \`4\`
**Explanation:** Rob houses \`1\` and \`3\` (\`1 + 3\`).

### Example 2
**Input:** \`nums = [2, 7, 9, 3, 1]\`
**Output:** \`12\` (\`2 + 9 + 1\`).`,
    recommended: {
      title: 'DP rob / skip',
      notes: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'For each house, choose better of skipping it or robbing it plus best two back.',
    },
    walkthroughs: {
      recommended: `Best through \`[1,2,3]\` becomes \`4\` by taking \`1+3\`; the last \`1\` does not improve it.`,
    },
  },
  'unique-paths': {
    examples: `### Example 1
**Input:** \`m = 3\`, \`n = 7\`
**Output:** \`28\`
**Explanation:** Paths only right/down on a 3×7 grid.`,
    recommended: {
      title: 'Grid DP',
      notes: 'Ways[r][c] = from above + from left',
      time: 'O(m · n)',
      space: 'O(n)',
      approach: 'Fill a row DP: each cell adds paths from the left and “above” (previous row value).',
    },
    walkthroughs: {
      recommended: `First row/col are all \`1\`. Interior cells accumulate until bottom-right is \`28\`.`,
    },
  },
  'coin-change': {
    examples: `### Example 1
**Input:** \`coins = [1, 2, 5]\`, \`amount = 11\`
**Output:** \`3\`
**Explanation:** \`5 + 5 + 1\`.

### Example 2
**Input:** \`coins = [2]\`, \`amount = 3\`
**Output:** \`-1\`.`,
    recommended: {
      title: 'Unbounded knapsack DP',
      notes: 'Min coins for every amount up to target',
      time: 'O(amount · coins)',
      space: 'O(amount)',
      approach: 'For each amount, try each coin and take 1 + best of the remainder.',
    },
    walkthroughs: {
      recommended: `Build up to \`11\`: after having \`5\`, \`10\` needs one more \`1\` → three coins total.`,
    },
  },
  'shopping-offers': {
    examples: `### Example
**Prices** \`[2, 5]\`, specials like \`[3, 0, 5]\` meaning 3 of item0 for \`$5\`, needs \`[3, 2]\`.
Return the lowest cost using any mix of singles and offers.`,
    recommended: {
      title: 'DFS + memo on remaining needs',
      notes: 'Try each offer or buy leftovers at list price',
      time: 'State-space exponential',
      space: 'Memo on needs',
      approach: 'Recurse on the leftover needs tuple; cache the best price for each leftover.',
    },
    walkthroughs: {
      recommended: `Compare “pay list prices for leftovers” vs applying a valid special and recursing; memo stops repeat states.`,
    },
  },
  'jump-game': {
    examples: `### Example 1
**Input:** \`nums = [2, 3, 1, 1, 4]\`
**Output:** \`true\`
**Explanation:** Jump 1 then 3 steps to the end.

### Example 2
**Input:** \`nums = [3, 2, 1, 0, 4]\`
**Output:** \`false\`.`,
    recommended: {
      title: 'Greedy farthest reach',
      notes: 'Track the farthest index reachable so far',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'Scan left to right; if you ever stand beyond farthest, fail; else update farthest.',
    },
    walkthroughs: {
      recommended: `At index \`0\` farthest becomes \`2\`; from \`1\` farthest becomes \`4\`, which reaches the end → \`true\`.`,
    },
  },
  'gas-station': {
    examples: `### Example 1
**Input:** \`gas = [1, 2, 3, 4, 5]\`, \`cost = [3, 4, 5, 1, 2]\`
**Output:** \`3\`
**Explanation:** Starting at station \`3\` completes the circuit.`,
    recommended: {
      title: 'One-pass gain reset',
      notes: 'If total gas < total cost, impossible',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'Track tank; when tank goes negative, reset start to i+1 and zero tank.',
    },
    walkthroughs: {
      recommended: `Early stations drain the tank below zero, so start moves forward until index \`3\`, which finishes with non-negative total.`,
    },
  },
  'search-in-rotated-sorted-array': {
    examples: `### Example 1
**Input:** \`nums = [4, 5, 6, 7, 0, 1, 2]\`, \`target = 0\`
**Output:** \`4\`.`,
    recommended: {
      title: 'Modified binary search',
      notes: 'Decide which half is sorted',
      time: 'O(log n)',
      space: 'O(1)',
      approach: 'Check mid; search inside the sorted half if target lies there, else the other half.',
    },
    walkthroughs: {
      recommended: `Mid might be \`7\`; left half sorted \`4…7\` does not contain \`0\`, so search right and find \`0\` at index \`4\`.`,
    },
  },
  'koko-eating-bananas': {
    examples: `### Example 1
**Input:** \`piles = [3, 6, 7, 11]\`, \`h = 8\`
**Output:** \`4\`
**Explanation:** Speed \`4\` finishes in \`8\` hours.`,
    recommended: {
      title: 'Binary search on speed',
      notes: 'Feasible if hoursNeeded(k) ≤ h',
      time: 'O(n log maxPile)',
      space: 'O(1)',
      approach: 'Search eating speed between 1 and max pile; shrink toward the minimal feasible k.',
    },
    walkthroughs: {
      recommended: `Try mid speed \`6\` — works but maybe lower; keep searching down until \`4\` is the smallest that still fits \`h = 8\`.`,
    },
  },
  'capacity-to-ship-packages-within-d-days': {
    examples: `### Example 1
**Input:** \`weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\`, \`days = 5\`
**Output:** \`15\`
**Explanation:** Least capacity that ships in 5 days.`,
    recommended: {
      title: 'Binary search on capacity',
      notes: 'Greedy pack days for a mid capacity',
      time: 'O(n log Σw)',
      space: 'O(1)',
      approach: 'Search capacity from max(weight) to sum(weights); check how many days a mid needs.',
    },
    walkthroughs: {
      recommended: `Capacity \`15\` packs the sequence into 5 days; smaller mid values need more than 5 → answer \`15\`.`,
    },
  },
  'single-number': {
    examples: `### Example 1
**Input:** \`nums = [2, 2, 1]\`
**Output:** \`1\`
**Explanation:** Every value appears twice except \`1\`.`,
    recommended: {
      title: 'XOR fold',
      notes: 'x^x = 0, x^0 = x',
      time: 'O(n)',
      space: 'O(1)',
      approach: 'XOR all numbers; pairs cancel, the unique remains.',
    },
    walkthroughs: {
      recommended: `\`2 ^ 2 ^ 1 = 0 ^ 1 = 1\`.`,
    },
  },
  'number-of-1-bits': {
    examples: `### Example 1
**Input:** \`n = 11\` (\`1011\`)
**Output:** \`3\`
**Explanation:** Three set bits.`,
    recommended: {
      title: 'Brian Kernighan / bit loop',
      notes: 'n &= n - 1 clears lowest set bit',
      time: 'O(#bits)',
      space: 'O(1)',
      approach: 'Count how many times you can clear the lowest set bit until n is 0.',
    },
    walkthroughs: {
      recommended: `\`1011\` → clear to \`1010\` → \`1000\` → \`0\` (three steps).`,
    },
  },
  'rotate-image': {
    examples: `### Example 1
**Input:** \`matrix = [[1,2,3],[4,5,6],[7,8,9]]\`
**Output:** \`[[7,4,1],[8,5,2],[9,6,3]]\`
**Explanation:** 90° clockwise in-place.`,
    recommended: {
      title: 'Transpose then reverse rows',
      notes: 'Or layer cycles',
      time: 'O(n²)',
      space: 'O(1)',
      approach: 'Transpose the matrix, then reverse each row for a clockwise turn.',
    },
    walkthroughs: {
      recommended: `Transpose → \`[[1,4,7],[2,5,8],[3,6,9]]\`, reverse rows → \`[[7,4,1],…]\`.`,
    },
  },
  'spiral-matrix': {
    examples: `### Example 1
**Input:** \`matrix = [[1,2,3],[4,5,6],[7,8,9]]\`
**Output:** \`[1,2,3,6,9,8,7,4,5]\`.`,
    recommended: {
      title: 'Four-boundary walk',
      notes: 'Shrink top/bottom/left/right',
      time: 'O(n · m)',
      space: 'O(1) extra',
      approach: 'Traverse right, down, left, up, then move the boundaries inward.',
    },
    walkthroughs: {
      recommended: `Layer 0 reads \`1 2 3 6 9 8 7 4\`, then the center \`5\`.`,
    },
  },
  'merge-intervals': {
    examples: `### Example 1
**Input:** \`intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]\`
**Output:** \`[[1, 6], [8, 10], [15, 18]]\`
**Explanation:** \`[1,3]\` and \`[2,6]\` overlap.`,
    recommended: {
      title: 'Sort then merge',
      notes: 'Extend end while overlapping',
      time: 'O(n log n)',
      space: 'O(n)',
      approach: 'Sort by start; if the next starts before current end, merge ends; else push a new interval.',
    },
    walkthroughs: {
      recommended: `After sort, \`[1,3]\` merges with \`[2,6]\` into \`[1,6]\`; later intervals do not overlap.`,
    },
  },
  'meeting-rooms-ii': {
    examples: `### Example 1
**Input:** \`intervals = [[0, 30], [5, 10], [15, 20]]\`
**Output:** \`2\`
**Explanation:** Need two rooms at the overlapping time.`,
    recommended: {
      title: 'Chronological start/end sweep',
      notes: 'Sort starts and ends separately',
      time: 'O(n log n)',
      space: 'O(n)',
      approach: 'Scan events; a start needs a room (+1), an end frees one (−1); track the peak.',
    },
    walkthroughs: {
      recommended: `Start \`0\` → rooms 1; start \`5\` → 2; end \`10\` → 1; … peak is \`2\`.`,
    },
  },
  'my-calendar-i': {
    examples: `### Example
\`book(10, 20) → true\`, \`book(15, 25) → false\` (overlaps), \`book(20, 30) → true\` (touches OK).`,
    recommended: {
      title: 'Store intervals; reject overlaps',
      notes: 'Touching endpoints are allowed',
      time: 'O(n) per book naive',
      space: 'O(n)',
      approach: 'On each book, check against existing ranges; insert only if no overlap.',
    },
    walkthroughs: {
      recommended: `\`[10,20)\` is stored. \`[15,25)\` hits it → false. \`[20,30)\` only touches → true.`,
    },
  },
  'implement-trie-prefix-tree': {
    examples: `### Example
\`insert("apple")\`, \`search("apple") → true\`, \`search("app") → false\`, \`startsWith("app") → true\`, \`insert("app")\`, \`search("app") → true\`.`,
    recommended: {
      title: 'Tree of character nodes',
      notes: 'isEnd marks complete words',
      time: 'O(L) per op',
      space: 'O(total chars)',
      approach: 'Each insert walks/creates child nodes; search requires ending on \`isEnd\`.',
    },
    walkthroughs: {
      recommended: `Inserting \`"apple"\` builds \`a-p-p-l-e\` with end on \`e\`. \`"app"\` exists as a path but not as a word until you insert it.`,
    },
  },
};

function insertExamples(readme, examplesMd) {
  if (/## Examples\b/.test(readme)) {
    return readme.replace(/## Examples\n[\s\S]*?(?=\n## |\n*$)/, `## Examples\n\n${examplesMd.trim()}\n\n`);
  }
  const problemMatch = readme.match(/## Problem\n[\s\S]*?(?=\n## )/);
  if (!problemMatch) {
    // append before Key Extract or at end
    if (/## Key Extract/.test(readme)) {
      return readme.replace(/## Key Extract/, `## Examples\n\n${examplesMd.trim()}\n\n## Key Extract`);
    }
    return `${readme.trim()}\n\n## Examples\n\n${examplesMd.trim()}\n`;
  }
  const end = problemMatch.index + problemMatch[0].length;
  return `${readme.slice(0, end)}\n## Examples\n\n${examplesMd.trim()}\n\n${readme.slice(end)}`;
}

function appendWalkthrough(description, walkthrough) {
  if (!walkthrough) return description;
  if (/Example walkthrough/i.test(description || '')) {
    return description.replace(
      /\n\n\*\*Example walkthrough:\*\*[\s\S]*$/,
      `\n\n**Example walkthrough:** ${walkthrough}`,
    );
  }
  return `${(description || '').trim()}\n\n**Example walkthrough:** ${walkthrough}`;
}

function ensureSolutionsJson(dir, slug, entry) {
  const file = path.join(dir, 'solutions.json');
  const wt = entry.walkthroughs || {};
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const sol of data.solutions) {
      sol.description = appendWalkthrough(sol.description, wt[sol.id]);
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    return 'updated';
  }

  const rec = entry.recommended;
  if (!rec) return 'skip-no-recommended';
  const data = {
    solutions: [
      {
        id: 'recommended',
        title: rec.title,
        file: 'solution.ts',
        source: 'repo',
        notes: rec.notes,
        time: rec.time,
        space: rec.space,
        description: appendWalkthrough(`**Approach:** ${rec.approach}`, wt.recommended),
      },
    ],
  };
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return 'created';
}

let readmeCount = 0;
let solUpdated = 0;
let solCreated = 0;
let missing = [];

for (const topic of fs.readdirSync(path.join(ROOT, 'topics'))) {
  const problemsDir = path.join(ROOT, 'topics', topic, 'problems');
  if (!fs.existsSync(problemsDir)) continue;
  for (const slug of fs.readdirSync(problemsDir)) {
    const dir = path.join(problemsDir, slug);
    if (!fs.existsSync(path.join(dir, 'meta.json'))) continue;
    const entry = DATA[slug];
    if (!entry) {
      missing.push(slug);
      continue;
    }

    const readmePath = path.join(dir, 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf8');
    fs.writeFileSync(readmePath, insertExamples(readme, entry.examples));
    readmeCount++;

    const result = ensureSolutionsJson(dir, slug, entry);
    if (result === 'updated') solUpdated++;
    if (result === 'created') solCreated++;
  }
}

console.log({ readmeCount, solUpdated, solCreated, missing });
if (missing.length) {
  console.error('Missing DATA for', missing);
  process.exit(1);
}
