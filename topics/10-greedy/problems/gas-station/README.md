# Gas Station

## Problem

Circular route; `gas[i]`, `cost[i]`. Return starting index to complete circuit, or -1.

## Examples

### Example 1
**Input:** `gas = [1, 2, 3, 4, 5]`, `cost = [3, 4, 5, 1, 2]`
**Output:** `3`
**Explanation:** Starting at station `3` completes the circuit.


## Recognition

Greedy: if total gas < total cost → impossible. Otherwise unique start = index after the worst prefix tank.

## Key Extract

Reset start after tank goes negative. One pass. Prove uniqueness via total ≥ 0.
