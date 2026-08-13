/**
 * Build an empty TypeScript starter from the recommended solution signature
 * (function/class with opening braces), falling back to cases.json metadata.
 */

function findMatchingBrace(source: string, openIndex: number): number {
  if (source[openIndex] !== '{') return -1;
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function extractFunctionStub(code: string, exportName: string): string | null {
  const re = new RegExp(`export\\s+(?:async\\s+)?function\\s+${exportName}\\s*\\(`);
  const match = re.exec(code);
  if (!match) return null;

  let i = match.index + match[0].length;
  let depth = 1;
  for (; i < code.length; i++) {
    const ch = code[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }

  while (i < code.length && /\s/.test(code[i])) i++;
  if (code[i] === ':') {
    i++;
    while (i < code.length && code[i] !== '{') i++;
  } else {
    while (i < code.length && code[i] !== '{') i++;
  }
  if (code[i] !== '{') return null;

  const signature = code.slice(match.index, i).trim();
  return `${signature} {\n  \n}\n`;
}

function extractClassStub(code: string, exportName: string): string | null {
  const re = new RegExp(`export\\s+class\\s+${exportName}\\b[^{]*\\{`);
  const match = re.exec(code);
  if (!match) return null;

  const openIndex = match.index + match[0].length - 1;
  const closeIndex = findMatchingBrace(code, openIndex);
  if (closeIndex < 0) return null;

  const body = code.slice(openIndex + 1, closeIndex);
  const methods: string[] = [];

  // constructor(...) { ... } or name(...): Ret { ... }
  const methodRe =
    /(?:^|\n)([ \t]*)(?:(?:public|private|protected|readonly|static|async)\s+)*((?:constructor|[A-Za-z_$][\w$]*))\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\{/g;

  let methodMatch: RegExpExecArray | null;
  while ((methodMatch = methodRe.exec(body)) !== null) {
    const indent = '  ';
    const name = methodMatch[2];
    const args = methodMatch[3].trim();
    const ret = methodMatch[4]?.trim();
    if (name === 'constructor') {
      methods.push(`${indent}constructor(${args}) {\n${indent}  \n${indent}}`);
    } else {
      const retPart = ret ? `: ${ret}` : '';
      methods.push(`${indent}${name}(${args})${retPart} {\n${indent}  \n${indent}}`);
    }
  }

  if (methods.length === 0) {
    return `export class ${exportName} {\n  \n}\n`;
  }

  return `export class ${exportName} {\n${methods.join('\n\n')}\n}\n`;
}

export function buildTypescriptStarter(opts: {
  solutionCode?: string;
  exportName?: string;
  type?: string;
  argNames?: string[];
}): string {
  const exportName =
    opts.exportName && /^[A-Za-z_$][\w$]*$/.test(opts.exportName)
      ? opts.exportName
      : 'solve';
  const type = opts.type === 'class' ? 'class' : 'function';
  const code = opts.solutionCode ?? '';

  if (code.trim()) {
    if (type === 'class') {
      const stub = extractClassStub(code, exportName);
      if (stub) return stub;
    } else {
      const stub = extractFunctionStub(code, exportName);
      if (stub) return stub;
    }
  }

  if (type === 'class') {
    return `export class ${exportName} {\n  constructor() {\n    \n  }\n}\n`;
  }

  const args = (opts.argNames ?? []).filter((n) => /^[A-Za-z_$][\w$]*$/.test(n));
  const params = args.map((n) => `${n}: unknown`).join(', ');
  return `export function ${exportName}(${params}) {\n  \n}\n`;
}
