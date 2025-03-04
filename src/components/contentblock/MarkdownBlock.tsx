import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeHighlighter } from './CodeHighlighter';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownBlockProps {
  content: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeBlockWrapperProps {
  children: React.ReactNode;
  code: string;
  language: string;
}

function CodeBlockWrapper({ children, code, language }: CodeBlockWrapperProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden group">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="text-xs bg-gray-700/90 backdrop-blur-sm px-2 py-1 rounded text-gray-300 font-mono">
          {language}
        </span>
        <button
          onClick={handleCopyCode}
          className="p-2 rounded-lg bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-white"
          title="Copy code"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      {children}
    </div>
  );
}

export function MarkdownBlock({ content }: MarkdownBlockProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-4xl font-extrabold my-6 pb-2 border-b border-border">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-3xl font-bold my-5 pb-1 border-b border-border/50">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-bold my-4">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xl font-semibold my-3 text-muted-foreground">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-lg font-medium my-2 text-muted-foreground/90">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-base font-medium my-2 text-muted-foreground/80 italic">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="text-base text-muted-foreground my-2">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
        ),
        code: ({ node, inline, className, children, ...props }: CodeProps) => {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');
          
          if (!inline && match) {
            const language = match[1];
            const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
            
            return (
              <CodeBlockWrapper code={code} language={displayLanguage}>
                <CodeHighlighter
                  code={code}
                  extension={`.${language}`}
                />
              </CodeBlockWrapper>
            );
          }
          
          return (
            <code className="bg-muted px-1.5 py-0.5 rounded-md" {...props}>
              {children}
            </code>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-2">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 bg-muted font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 border-t border-border">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
