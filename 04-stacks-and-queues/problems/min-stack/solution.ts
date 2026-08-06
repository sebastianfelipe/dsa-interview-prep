export class MinStack {
  private stack: number[] = [];
  private mins: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const min = this.mins.length ? Math.min(val, this.mins[this.mins.length - 1]!) : val;
    this.mins.push(min);
  }

  pop(): void {
    this.stack.pop();
    this.mins.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1]!;
  }

  getMin(): number {
    return this.mins[this.mins.length - 1]!;
  }
}
