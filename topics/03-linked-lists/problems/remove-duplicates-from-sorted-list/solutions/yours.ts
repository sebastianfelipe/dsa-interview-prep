import { ListNode } from '@lib/helpers';
export function deleteDuplicates(head: ListNode | null): ListNode | null {
  let current = head;
  while (current?.next) {
    if (current.val === current.next.val) {
      current.next = current.next.next;
      continue;
    }
    current = current.next;
  }
  return head;
}
