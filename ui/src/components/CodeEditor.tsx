import { useEffect, useMemo, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
        onScroll={syncScroll}
        aria-label={ariaLabel}
      />
    </div>
  );
}
