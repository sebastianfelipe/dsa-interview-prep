export function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let pivot = 0;
  for (let i = 0; i < n + m; i++) {
    if (nums2[pivot] === undefined) {
      break;
    }

    if (i >= m + pivot || nums1[i]! >= nums2[pivot]!) {
      nums1.splice(i, 0, nums2[pivot]!);
      nums1.pop();
      pivot++;
    }
  }
}
