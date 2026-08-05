# Gas Station

## Problem

Circular route; `gas[i]`, `cost[i]`. Return starting index to complete circuit, or -1.

## Recognition

Greedy: if total gas < total cost → impossible. Otherwise unique start = index after the worst prefix tank.

## Code (TypeScript)

```ts
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let total = 0;
  let tank = 0;
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i]! - cost[i]!;
    total += diff;
    tank += diff;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total < 0 ? -1 : start;
}
```

## Key Extract

Reset start after tank goes negative. One pass. Prove uniqueness via total ≥ 0.
