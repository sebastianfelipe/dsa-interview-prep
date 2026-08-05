/** Disjoint Set Union (Union-Find) with path compression + union by rank. */
export class UnionFind {
  private parent: number[];
  private rank: number[];
  components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
    this.components = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]!);
    return this.parent[x]!;
  }

  union(a: number, b: number): boolean {
    let pa = this.find(a);
    let pb = this.find(b);
    if (pa === pb) return false;
    if (this.rank[pa]! < this.rank[pb]!) [pa, pb] = [pb, pa];
    this.parent[pb] = pa;
    if (this.rank[pa] === this.rank[pb]) this.rank[pa]! += 1;
    this.components -= 1;
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}
