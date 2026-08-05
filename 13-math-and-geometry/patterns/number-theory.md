# Pattern: Number Theory Basics

## Must-know

```ts
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
```

- Prime checks up to √n
- Modular arithmetic for huge counts (`% MOD`)
- Pow by squaring

## Key Extract

GCD via Euclidean algorithm. Mention MOD early when counts explode.
