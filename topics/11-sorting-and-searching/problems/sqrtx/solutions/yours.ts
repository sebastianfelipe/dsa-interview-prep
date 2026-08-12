export function mySqrt(x: number): number {
  let left = 0;
  let right = x;
  let guess = x;
  while (true) {
    const estimatedX = guess * guess;
    if (estimatedX === x) {
      return guess;
    }
    if (estimatedX < x) {
      if ((guess + 1) * (guess + 1) > x) {
        return guess;
      }
      left = guess;
    }
    if (estimatedX > x) {
      if ((guess - 1) * (guess - 1) < x) {
        return guess - 1;
      }
      right = guess;
    }
    guess = Math.floor((left + right) / 2);
  }
}
