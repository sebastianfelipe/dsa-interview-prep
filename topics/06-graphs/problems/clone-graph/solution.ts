import { Node } from '@lib/helpers';

export function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const map = new Map<Node, Node>();

  const dfs = (n: Node): Node => {
    if (map.has(n)) return map.get(n)!;
    const copy = new Node(n.val);
    map.set(n, copy);
    for (const nei of n.neighbors) {
      copy.neighbors.push(dfs(nei));
    }
    return copy;
  };

  return dfs(node);
}
