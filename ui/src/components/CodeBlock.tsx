import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import { formatSourceCode } from '../format-code';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

export function CodeBlock({
  code,
  language = 'typescript',
  className = '',
  format = true,
  'aria-hidden': ariaHidden,
}: {
  code: string;
  language?: string;
  className?: string;
  /** Pretty-print collapsed / escaped one-liners before highlighting. */
  format?: boolean;
  'aria-hidden'?: boolean;
}) {
  const displayCode = useMemo(
    () => (format ? formatSourceCode(code, language) : code),
    [code, language, format],
  );

  const html = useMemo(() => {
    try {
      return hljs.highlight(displayCode, { language, ignoreIllegals: true }).value;
    } catch {
      return hljs.highlightAuto(displayCode).value;
    }
  }, [displayCode, language]);

  return (
    <pre className={`code-block hljs ${className}`.trim()} aria-hidden={ariaHidden}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
