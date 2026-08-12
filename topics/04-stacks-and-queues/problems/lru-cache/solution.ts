class DLLNode {
  key: number;
  value: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
  }
}
export class LRUCache {
  private capacity: number;
  private map = new Map<number, DLLNode>();
  private head = new DLLNode();
  private tail = new DLLNode();
  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  get(key: number): number {
    const node = this.map.get(key);
    if (!node) {
      return -1;
    }
    this.moveToHead(node);
    return node.value;
  }
  put(key: number, value: number): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }
    const node = new DLLNode(key, value);
    this.map.set(key, node);
    this.addToHead(node);
    if (this.map.size > this.capacity) {
      const lru = this.removeTail();
      this.map.delete(lru.key);
    }
  }
  private addToHead(node: DLLNode) {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }
  private removeNode(node: DLLNode) {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }
  private moveToHead(node: DLLNode) {
    this.removeNode(node);
    this.addToHead(node);
  }
  private removeTail(): DLLNode {
    const node = this.tail.prev;
    if (!node || node === this.head) {
      throw new Error('LRUCache is empty');
    }
    this.removeNode(node);
    return node;
  }
}
