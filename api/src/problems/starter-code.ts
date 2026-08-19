/**
 * Build an empty TypeScript starter from the recommended solution signature
 * (function/class with opening braces), falling back to cases.json metadata.
 */

const CONTROL_FLOW = new Set([
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'function',
  'with',
]);

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

  // Line-start method declarations only. Skip private helpers and control-flow (`if (`).
  const methodRe =
    /(?:^|\n)([ \t]*)((?:(?:public|private|protected|readonly|static|async)\s+)*)(constructor|[A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\{/g;

  let methodMatch: RegExpExecArray | null;
  while ((methodMatch = methodRe.exec(body)) !== null) {
    const modifiers = methodMatch[2] ?? '';
    const name = methodMatch[3];
    const args = methodMatch[4].trim();
    const ret = methodMatch[5]?.trim();

    if (CONTROL_FLOW.has(name)) continue;
    if (/\bprivate\b|\bprotected\b/.test(modifiers)) continue;

    const indent = '  ';
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

/**
 * SQL starter: comment header listing each table with its columns
 * (parsed from the problem's schema.sql), ready for the learner's query.
 */
export function buildSqlStarter(opts: { schemaSql?: string; title?: string }): string {
  const lines: string[] = ['-- Write one PostgreSQL query that returns the result table.'];

  const schema = opts.schemaSql ?? '';
  const tableRe = /CREATE\s+TABLE\s+([A-Za-z_][\w]*)\s*\(([\s\S]*?)\);/gi;
  let match: RegExpExecArray | null;
  while ((match = tableRe.exec(schema)) !== null) {
    const table = match[1];
    const columns: string[] = [];
    for (const rawLine of match[2].split(',')) {
      const line = rawLine.trim();
      if (!line || /^(PRIMARY|FOREIGN|UNIQUE|CONSTRAINT|CHECK)\b/i.test(line)) continue;
      const col = line.match(/^"?([A-Za-z_][\w]*)"?\s/);
      if (col) columns.push(col[1]);
    }
    lines.push(`-- Table ${table}(${columns.join(', ')})`);
  }

  return `${lines.join('\n')}\n\n`;
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
