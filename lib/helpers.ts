/** Shared helpers for solutions and tests. */
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
export class Node {
  val: number;
  neighbors: Node[];
  constructor(val = 0, neighbors: Node[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}
export function listFromArray(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let curr = head;
  while (curr) {
    out.push(curr.val);
    curr = curr.next;
  }
  return out;
}
/** Build a binary tree from level-order array (`null` for missing nodes). */
export function treeFromArray(arr: (number | null)[]): TreeNode | null {
  if (!arr.length || arr[0] == null) {
    return null;
  }
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (!node) {
      break;
    }
    if (i < arr.length && arr[i] != null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i += 1;
    if (i < arr.length && arr[i] != null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i += 1;
  }
  return root;
}
export function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) {
    return [];
  }
  const out: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node === undefined) {
      break;
    }
    if (!node) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (out.length && out[out.length - 1] == null) {
    out.pop();
  }
  return out;
}
