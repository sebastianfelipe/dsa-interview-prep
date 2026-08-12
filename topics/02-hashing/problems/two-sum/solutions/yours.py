from typing import List


def two_sum(nums: List[int], target: int) -> List[int]:
    for i1 in range(len(nums)):
        for i2 in range(i1 + 1, len(nums)):
            if nums[i1] + nums[i2] == target:
                return [i1, i2]
    return []
