# Shopping Offers

## Problem

In a shop with `n` kinds of items, `price[i]` is the unit price of the ith item. Special offers are lists where the first `n` numbers are item counts in the offer and the last number is the offer price. Given `needs`, return the lowest price to buy exactly those amounts (you may use specials any number of times, or buy individually).

## Recognition

Exact needs + optional specials → DFS/backtracking with memoization over remaining needs.

## Key Extract

State = remaining needs tuple. Recurse: try each special that fits, or pay remaining items at unit price. Memoize by serialized needs.
