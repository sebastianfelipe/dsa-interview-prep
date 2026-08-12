import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);

export function CodeBlock({
  code,
  language = 'typescript',
  className = '',
  'aria-hidden': ariaHidden,
}: {
  code: string;
  language?: string;
  className?: string;
  'aria-hidden'?: boolean;
}) {
  const html = useMemo(() => {
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }, [code, language]);

  return (
    <pre className={`code-block hljs ${className}`.trim()} aria-hidden={ariaHidden}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
