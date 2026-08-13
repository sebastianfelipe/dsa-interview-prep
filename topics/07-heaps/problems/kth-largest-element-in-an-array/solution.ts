import { MinHeap } from '../../../../resources/templates/heap';

export function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap<number>((a, b) => a - b);
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) {
      heap.pop();
    }
  }
  return heap.peek();
}
