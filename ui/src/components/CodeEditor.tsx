import { useEffect, useMemo, useRef, type KeyboardEvent } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('sql', sql);

const INDENT = '  ';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function lineStart(value: string, index: number): number {
  return value.lastIndexOf('\n', index - 1) + 1;
}

function lineEnd(value: string, index: number): number {
  const next = value.indexOf('\n', index);
  return next === -1 ? value.length : next;
}

function leadingWs(line: string): string {
  return line.match(/^[ \t]*/)?.[0] ?? '';
}

function dedentLine(line: string): { line: string; cut: number } {
  const lead = leadingWs(line);
  const cut = lead.startsWith('\t')
    ? 1
    : lead.startsWith(INDENT)
      ? INDENT.length
      : Math.min(INDENT.length, lead.length);
  return cut ? { line: line.slice(cut), cut } : { line, cut: 0 };
}

export function CodeEditor({
  value,
  language = 'typescript',
  onChange,
  className = '',
  'aria-label': ariaLabel = 'Code editor',
}: {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const highlighted = useMemo(() => {
    const source = value.endsWith('\n') ? value : `${value}\n`;
    try {
      return hljs.highlight(source, { language, ignoreIllegals: true }).value;
    } catch {
      return escapeHtml(source);
    }
  }, [value, language]);

  function syncScroll() {
    const ta = textareaRef.current;
    const pre = highlightRef.current;
    if (!ta || !pre) return;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
  }

  useEffect(() => {
    syncScroll();
  }, [value]);

  function commit(next: string, cursor: number, endCursor = cursor) {
    onChange(next);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.selectionStart = cursor;
      ta.selectionEnd = endCursor;
      syncScroll();
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      const rangeStart = lineStart(value, start);
      const rangeEnd = lineEnd(value, Math.max(end - (end > start ? 1 : 0), rangeStart));
      const range = value.slice(rangeStart, rangeEnd);

      if (e.shiftKey) {
        let cutFirst = 0;
        let cutTotal = 0;
        const dedented = range
          .split('\n')
          .map((line, i) => {
            const { line: nextLine, cut } = dedentLine(line);
            if (i === 0) cutFirst = cut;
            cutTotal += cut;
            return nextLine;
          })
          .join('\n');
        const next = value.slice(0, rangeStart) + dedented + value.slice(rangeEnd);
        const nextStart = Math.max(rangeStart, start - cutFirst);
        const nextEnd = end === start ? nextStart : Math.max(rangeStart, end - cutTotal);
        commit(next, nextStart, nextEnd);
        return;
      }

      if (start !== end) {
        const lines = range.split('\n');
        const indented = lines.map((line) => INDENT + line).join('\n');
        const next = value.slice(0, rangeStart) + indented + value.slice(rangeEnd);
        commit(next, start + INDENT.length, end + INDENT.length * lines.length);
        return;
      }

      const next = value.slice(0, start) + INDENT + value.slice(end);
      commit(next, start + INDENT.length);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const startOfLine = lineStart(value, start);
      const currentLine = value.slice(startOfLine, start);
      const indent = leadingWs(currentLine);
      const trimmed = currentLine.trimEnd();
      const shouldNest =
        /[\{\(\[:]$/.test(trimmed) || /=>\s*$/.test(trimmed);
      const insert = `\n${indent}${shouldNest ? INDENT : ''}`;
      const after = value.slice(end);

      if (shouldNest && /^\s*\}/.test(after)) {
        const closing = `\n${indent}}`;
        const rest = after.replace(/^\s*\}/, '');
        const next = value.slice(0, start) + insert + closing + rest;
        commit(next, start + insert.length);
        return;
      }

      const next = value.slice(0, start) + insert + value.slice(end);
      commit(next, start + insert.length);
    }
  }

  return (
    <div className={`code-editor ${className}`.trim()}>
      <pre
        ref={highlightRef}
        className="code-editor-highlight code-block hljs"
        aria-hidden="true"
      >
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <textarea
        ref={textareaRef}
        className="code-editor-input"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={syncScroll}
        aria-label={ariaLabel}
      />
    </div>
  );
}
