import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function isInternalAppPath(href: string | undefined): href is string {
  if (!href) return false;
  return href.startsWith('/reference/') || href.startsWith('/browse') || href.startsWith('/lists') || href.startsWith('/problems/');
}

const components: Components = {
  a({ href, children }) {
    if (isInternalAppPath(href)) {
      return <Link to={href}>{children}</Link>;
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

export function Markdown({ source }: { source: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
