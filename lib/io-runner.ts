import {
  ListNode,
  Node,
  TreeNode,
  listFromArray,
  listToArray,
  treeFromArray,
  treeToArray,
} from './helpers';
import type {
  CaseFile,
  CaseResult,
  ClassCase,
  ClassCaseFile,
  Codec,
  CompareMode,
  FunctionCaseFile,
  IoCase,
  JudgeResult,
} from './cases';

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (!deepEqual(ak, bk)) return false;
    return ak.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
    );
  }
  return false;
}

function sortedJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${[...value].map(sortedJson).sort().join(',')}]`;
  }
  return JSON.stringify(value);
}

function equals(actual: unknown, expected: unknown, mode: CompareMode): boolean {
  switch (mode) {
    case 'unordered':
      if (!Array.isArray(actual) || !Array.isArray(expected)) return deepEqual(actual, expected);
      return sortedJson(actual) === sortedJson(expected);
    case 'unorderedNested':
      if (!Array.isArray(actual) || !Array.isArray(expected)) return deepEqual(actual, expected);
      if (actual.length !== expected.length) return false;
      return (
        [...actual].map(sortedJson).sort().join('|') ===
        [...expected].map(sortedJson).sort().join('|')
      );
    default:
      return deepEqual(actual, expected);
  }
}

function listWithCycle(arr: number[], pos: number): ListNode | null {
  const head = listFromArray(arr);
  if (!head || pos < 0) return head;
  let cycleTo: ListNode | null = head;
  for (let i = 0; i < pos; i++) cycleTo = cycleTo?.next ?? null;
  let tail = head;
  while (tail.next) tail = tail.next;
  tail.next = cycleTo;
  return head;
}

function graphFromAdj(adj: number[][]): Node | null {
  if (!adj.length) return null;
  const nodes = adj.map((_, i) => new Node(i + 1));
  for (let i = 0; i < adj.length; i++) {
    nodes[i].neighbors = adj[i].map((v) => nodes[v - 1]);
  }
  return nodes[0] ?? null;
}

function graphToAdj(node: Node | null): number[][] {
  if (!node) return [];
  const map = new Map<number, Node>();
  const visit = (n: Node) => {
    if (map.has(n.val)) return;
    map.set(n.val, n);
    for (const nei of n.neighbors) visit(nei);
  };
  visit(node);
  const max = Math.max(...map.keys());
  const adj: number[][] = Array.from({ length: max }, () => []);
  for (const [val, n] of map) {
    adj[val - 1] = n.neighbors.map((x) => x.val).sort((a, b) => a - b);
  }
  return adj;
}

function findTreeNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findTreeNode(root.left, val) ?? findTreeNode(root.right, val);
}

function decodeArg(value: unknown, codec: Codec, ctx: { root?: TreeNode | null }): unknown {
  switch (codec) {
    case 'list':
      return listFromArray((value as number[]) ?? []);
    case 'listArray':
      return ((value as Array<number[] | null | undefined>) ?? []).map((arr) =>
        !arr || arr.length === 0 ? null : listFromArray(arr),
      );
    case 'listWithCycle': {
      const [arr, pos] = value as [number[], number];
      return listWithCycle(arr ?? [], pos ?? -1);
    }
    case 'tree':
      return treeFromArray((value as (number | null)[]) ?? []);
    case 'treeVal': {
      const node = findTreeNode(ctx.root ?? null, value as number);
      if (!node) throw new Error(`treeVal ${String(value)} not found in tree`);
      return node;
    }
    case 'graph':
      return graphFromAdj((value as number[][]) ?? []);
    case 'raw':
    default:
      return value;
  }
}

function encodeResult(value: unknown, codec: Codec): unknown {
  switch (codec) {
    case 'list':
      return listToArray(value as ListNode | null);
    case 'tree':
      return treeToArray(value as TreeNode | null);
    case 'treeVal':
      return value == null ? null : (value as TreeNode).val;
    case 'treeList':
      return (value as Array<TreeNode | null>).map((t) => treeToArray(t));
    case 'graph':
      return graphToAdj(value as Node | null);
    case 'raw':
    default:
      return value;
  }
}

function displayInputs(
  inputs: unknown[],
  argNames: string[] | undefined,
  argCodecs: Codec[] | undefined,
): unknown {
  if (argNames && argNames.length === inputs.length) {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < inputs.length; i++) {
      const codec = argCodecs?.[i] ?? 'raw';
      obj[argNames[i]] =
        codec === 'listWithCycle' ? inputs[i] : codec === 'raw' ? inputs[i] : inputs[i];
    }
    return obj;
  }
  return inputs.length === 1 ? inputs[0] : inputs;
}

function cloneJson<T>(value: T): T {
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

function prepareArgs(
  inputs: unknown[],
  file: FunctionCaseFile,
): { args: unknown[]; ctx: { root?: TreeNode | null }; display: unknown } {
  // Clone so in-place solutions cannot corrupt cases.json-backed fixtures.
  const clonedInputs = cloneJson(inputs);
  const codecs = file.argCodecs ?? clonedInputs.map(() => 'raw' as Codec);
  const ctx: { root?: TreeNode | null } = {};
  const args: unknown[] = [];

  // First pass: decode trees so treeVal can resolve against root
  for (let i = 0; i < clonedInputs.length; i++) {
    const codec = codecs[i] ?? 'raw';
    if (codec === 'tree') {
      const root = treeFromArray((clonedInputs[i] as (number | null)[]) ?? []);
      ctx.root = ctx.root ?? root;
      args[i] = root;
    }
  }

  for (let i = 0; i < clonedInputs.length; i++) {
    const codec = codecs[i] ?? 'raw';
    if (codec === 'tree') continue;
    args[i] = decodeArg(clonedInputs[i], codec, ctx);
  }

  return {
    args,
    ctx,
    // Display from the pristine inputs, not the mutable clones.
    display: displayInputs(inputs, file.argNames, codecs),
  };
}

function runFunctionCase(
  mod: Record<string, unknown>,
  file: FunctionCaseFile,
  c: IoCase,
): CaseResult {
  const fn = mod[file.exportName];
  if (typeof fn !== 'function') {
    return {
      id: c.id,
      status: 'error',
      inputs: c.inputs,
      expected: c.expected,
      error: `Export '${file.exportName}' is not a function`,
    };
  }

  try {
    const compare = file.compare ?? 'deep';
    const { args, display } = prepareArgs(c.inputs, file);
    const raw = (fn as (...a: unknown[]) => unknown)(...args);

    let actual: unknown;
    if (compare === 'inplace') {
      const idx = file.inplaceArg ?? 0;
      actual = args[idx];
    } else if (compare === 'inplaceLength') {
      const idx = file.inplaceArg ?? 0;
      const k = raw as number;
      const arr = args[idx] as unknown[];
      actual = { return: k, values: arr.slice(0, k) };
    } else {
      actual = encodeResult(raw, file.resultCodec ?? 'raw');
    }

    const expected =
      compare === 'inplaceLength' && Array.isArray(c.expected)
        ? { return: (c.expected as unknown[]).length, values: c.expected }
        : c.expected;

    const ok =
      compare === 'inplaceLength'
        ? deepEqual(actual, expected)
        : equals(actual, expected, compare === 'inplace' ? 'deep' : compare);

    return {
      id: c.id,
      status: ok ? 'passed' : 'failed',
      inputs: display,
      expected: c.expected,
      actual: compare === 'inplaceLength' ? (actual as { values: unknown }).values : actual,
      error: ok
        ? undefined
        : `Expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(
            compare === 'inplaceLength' ? (actual as { values: unknown }).values : actual,
          )}`,
    };
  } catch (err) {
    return {
      id: c.id,
      status: 'error',
      inputs: displayInputs(c.inputs, file.argNames, file.argCodecs),
      expected: c.expected,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function runClassCase(
  mod: Record<string, unknown>,
  file: ClassCaseFile,
  c: ClassCase,
): CaseResult {
  const Ctor = mod[file.exportName];
  if (typeof Ctor !== 'function') {
    return {
      id: c.id,
      status: 'error',
      inputs: { ops: c.ops, args: c.args },
      expected: c.expected,
      error: `Export '${file.exportName}' is not a class`,
    };
  }

  try {
    const actual: unknown[] = [];
    let instance: Record<string, unknown> | null = null;

    for (let i = 0; i < c.ops.length; i++) {
      const op = c.ops[i];
      const opArgs = c.args[i] ?? [];
      if (i === 0 || op === file.exportName) {
        const ctorCodecs = file.ctorCodecs ?? [];
        const decoded = cloneJson(opArgs).map((arg, idx) =>
          decodeArg(arg, ctorCodecs[idx] ?? 'raw', {}),
        );
        instance = Reflect.construct(
          Ctor as new (...a: unknown[]) => Record<string, unknown>,
          decoded,
        );
        actual.push(null);
        continue;
      }
      if (!instance) throw new Error('Class instance was not constructed');
      const method = instance[op];
      if (typeof method !== 'function') throw new Error(`Missing method '${op}'`);
      const value = (method as (...a: unknown[]) => unknown).apply(instance, opArgs);
      actual.push(value === undefined ? null : value);
    }

    const ok = deepEqual(actual, c.expected);
    return {
      id: c.id,
      status: ok ? 'passed' : 'failed',
      inputs: { ops: c.ops, args: c.args },
      expected: c.expected,
      actual,
      error: ok
        ? undefined
        : `Expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(actual)}`,
    };
  } catch (err) {
    return {
      id: c.id,
      status: 'error',
      inputs: { ops: c.ops, args: c.args },
      expected: c.expected,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function selectCases(file: CaseFile, mode: 'run' | 'submit'): Array<IoCase | ClassCase> {
  if (mode === 'run') return file.examples;
  return [...file.examples, ...file.edgeCases];
}

export function runCaseFile(
  mod: Record<string, unknown>,
  file: CaseFile,
  mode: 'run' | 'submit',
): JudgeResult {
  const started = Date.now();
  const selected = selectCases(file, mode);
  const cases: CaseResult[] =
    file.type === 'function'
      ? (selected as IoCase[]).map((c) => runFunctionCase(mod, file, c))
      : (selected as ClassCase[]).map((c) => runClassCase(mod, file, c));

  const passed = cases.filter((c) => c.status === 'passed').length;
  const failed = cases.length - passed;
  return {
    passed: failed === 0 && cases.length > 0,
    mode,
    summary: { total: cases.length, passed, failed },
    cases,
    durationMs: Date.now() - started,
  };
}

export async function loadModule(solutionPath: string): Promise<Record<string, unknown>> {
  const { pathToFileURL } = await import('url');
  const href = pathToFileURL(solutionPath).href;
  // Cache-bust so repeated runs pick up rewritten temp files
  const mod = await import(`${href}?t=${Date.now()}`);
  return mod as Record<string, unknown>;
}

export async function judgeSolution(
  solutionPath: string,
  file: CaseFile,
  mode: 'run' | 'submit',
): Promise<JudgeResult> {
  try {
    const mod = await loadModule(solutionPath);
    return runCaseFile(mod, file, mode);
  } catch (err) {
    return {
      passed: false,
      mode,
      summary: { total: 1, passed: 0, failed: 1 },
      cases: [
        {
          id: 'compile',
          status: 'error',
          inputs: null,
          expected: null,
          error: err instanceof Error ? err.message : String(err),
        },
      ],
      durationMs: 0,
    };
  }
}
