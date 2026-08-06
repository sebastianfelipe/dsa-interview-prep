# Gas Station

## Problem

Circular route; `gas[i]`, `cost[i]`. Return starting index to complete circuit, or -1.

## Recognition

Greedy: if total gas < total cost → impossible. Otherwise unique start = index after the worst prefix tank.

## Key Extract

Reset start after tank goes negative. One pass. Prove uniqueness via total ≥ 0.
