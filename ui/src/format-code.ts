import type { CodeLanguage } from './code-language';

/** Turn literal \\n / \\t sequences into real whitespace when models escape too hard. */
export function decodeEscapedNewlines(code: string): string {
  if (code.includes('\n')) return code;
  if (!code.includes('\\n') && !code.includes('\\t')) return code;
  return code.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '');
}

function newlineCount(code: string): number {
  return (code.match(/\n/g) ?? []).length;
}

function looksCollapsed(code: string): boolean {
  if (newlineCount(code) >= 2) return false;
  return code.length > 80 || /[{;}]/.test(code) || /:\s+\S/.test(code);
}

function ensureTrailingNewline(code: string): string {
  const trimmed = code.replace(/\s+$/g, '');
  return trimmed ? `${trimmed}\n` : '';
}

function tidySpaces(code: string): string {
  return code
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\{\s+\n/g, '{\n')
    .trim();
}

/** Lightweight TypeScript/JavaScript pretty-printer for collapsed one-liners. */
export function formatTypeScriptLike(code: string): string {
  let s = decodeEscapedNewlines(code).replace(/\r\n/g, '\n').trim();
  if (!looksCollapsed(s)) return ensureTrailingNewline(s);

  s = s.replace(/\t/g, '  ').replace(/ +/g, ' ');
  let out = '';
  let indent = 0;
  let i = 0;
  let inStr: '"' | "'" | '`' | null = null;
  let escape = false;
  let parenDepth = 0;

  const writeIndent = () => {
    out += '\n' + '  '.repeat(Math.max(indent, 0));
  };

  const peek = (n = 0) => s[i + n] ?? '';

  while (i < s.length) {
    const ch = s[i];

    if (inStr) {
      out += ch;
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === inStr) inStr = null;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === '(') {
      parenDepth += 1;
      out += ch;
      i += 1;
      continue;
    }

    if (ch === ')') {
      parenDepth = Math.max(parenDepth - 1, 0);
      out += ch;
      i += 1;
      continue;
    }

    if (ch === '{') {
      if (out && !/\s$/.test(out)) out += ' ';
      out += '{';
      indent += 1;
      writeIndent();
      i += 1;
      while (peek() === ' ') i += 1;
      continue;
    }

    if (ch === '}') {
      indent = Math.max(indent - 1, 0);
      writeIndent();
      out += '}';
      i += 1;
      while (peek() === ' ') i += 1;
      if (peek() === ';') {
        out += ';';
        i += 1;
      }
      if (peek() && peek() !== '}' && peek() !== ')' && peek() !== ',' && peek() !== ';') {
        writeIndent();
      }
      continue;
    }

    if (ch === ';' && parenDepth === 0) {
      out += ';';
      i += 1;
      while (peek() === ' ') i += 1;
      if (peek() && peek() !== '}') writeIndent();
      continue;
    }

    if (ch === ',') {
      out += ',';
      i += 1;
      while (peek() === ' ') i += 1;
      out += ' ';
      continue;
    }

    out += ch;
    i += 1;
  }

  return ensureTrailingNewline(tidySpaces(out));
}

/** Lightweight Python formatter for collapsed one-liners. */
export function formatPythonLike(code: string): string {
  let s = decodeEscapedNewlines(code).replace(/\r\n/g, '\n').trim();
  if (!looksCollapsed(s)) return ensureTrailingNewline(s);

  s = s
    .replace(/\s*;\s*/g, '\n')
    .replace(/\s+(?=def |class |if |elif |else:|for |while |try:|except |finally:|with |return |import |from )/g, '\n');

  const rawLines = s.split('\n').map((line) => line.trim()).filter(Boolean);
  const out: string[] = [];
  let indent = 0;

  for (const line of rawLines) {
    if (/^(elif |else:|except |finally:)/.test(line)) {
      indent = Math.max(indent - 1, 0);
    }

    const colonIdx = line.indexOf(':');
    if (
      colonIdx >= 0 &&
      !line.startsWith('#') &&
      /^(def |class |if |elif |else:|for |while |try:|except |finally:|with )/.test(line)
    ) {
      const head = line.slice(0, colonIdx + 1).trim();
      const rest = line.slice(colonIdx + 1).trim();
      out.push(`${'  '.repeat(indent)}${head}`);
      indent += 1;
      if (rest) {
        out.push(`${'  '.repeat(indent)}${rest}`);
        // Keep def/class blocks open; close one-line control bodies.
        if (!/^(def |class )/.test(line)) {
          indent = Math.max(indent - 1, 0);
        }
      }
      continue;
    }

    out.push(`${'  '.repeat(indent)}${line}`);
  }

  return ensureTrailingNewline(tidySpaces(out.join('\n')));
}

export function formatSourceCode(code: string, language: CodeLanguage | string): string {
  const normalized = decodeEscapedNewlines(code).replace(/\r\n/g, '\n');
  if (language === 'python' || language === 'py') return formatPythonLike(normalized);
  if (
    language === 'typescript' ||
    language === 'javascript' ||
    language === 'ts' ||
    language === 'js'
  ) {
    return formatTypeScriptLike(normalized);
  }
  return ensureTrailingNewline(normalized.trim());
}
