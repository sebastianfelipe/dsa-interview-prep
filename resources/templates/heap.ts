/**
 * Binary min-heap for interview use.
 * For max-heap, negate priorities or invert compare.
 */
export class MinHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(this.data[i]!, this.data[p]!) >= 0) break;
      [this.data[i], this.data[p]] = [this.data[p]!, this.data[i]!];
      i = p;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let best = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < n && this.compare(this.data[l]!, this.data[best]!) < 0) best = l;
      if (r < n && this.compare(this.data[r]!, this.data[best]!) < 0) best = r;
      if (best === i) break;
      [this.data[i], this.data[best]] = [this.data[best]!, this.data[i]!];
      i = best;
    }
  }
}

/** Kth largest in array via min-heap of size k. */
export function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap<number>((a, b) => a - b);
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}
