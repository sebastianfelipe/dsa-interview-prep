# Koko Eating Bananas

## Problem

Koko loves bananas. There are `n` piles of bananas; the `i`th pile has `piles[i]` bananas. Guards return in `h` hours. Koko can decide her eating speed `k` (bananas/hour). Each hour she chooses one pile and eats `min(k, pile)` bananas. Find the minimum integer `k` such that she can finish all bananas within `h` hours.

## Examples

### Example 1
**Input:** `piles = [3, 6, 7, 11]`, `h = 8`
**Output:** `4`
**Explanation:** Speed `4` finishes in `8` hours.


## Recognition

Minimize speed subject to finishing in `h` hours → binary search on answer.

## Key Extract

Feasibility: for speed `k`, hours = sum of `ceil(pile / k)`. Search `k` in `[1, max(piles)]`.
