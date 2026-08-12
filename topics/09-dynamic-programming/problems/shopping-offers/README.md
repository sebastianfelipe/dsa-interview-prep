# Shopping Offers

## Problem

In a shop with `n` kinds of items, `price[i]` is the unit price of the ith item. Special offers are lists where the first `n` numbers are item counts in the offer and the last number is the offer price. Given `needs`, return the lowest price to buy exactly those amounts (you may use specials any number of times, or buy individually).

## Examples

### Example 1
**Input:** `price = [2, 5]`, `special = [[3, 0, 5], [1, 2, 10]]`, `needs = [3, 2]`
**Output:** `14`
**Explanation:** Use special `[1, 2, 10]` once, then buy `2` more of item0 at `$2` each → `10 + 4 = 14` (cheaper than paying full list `3·2 + 2·5 = 16`).


## Recognition

Exact needs + optional specials → DFS/backtracking with memoization over remaining needs.

## Key Extract

State = remaining needs tuple. Recurse: try each special that fits, or pay remaining items at unit price. Memoize by serialized needs.
