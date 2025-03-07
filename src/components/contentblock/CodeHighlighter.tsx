import { Highlight, themes } from "prism-react-renderer";

interface CodeHighlighterProps {
  code: string;
  extension: string;
}

const getLanguage = (extension: string): string => {
  // First, remove the dot if it exists
  const lang = extension.startsWith(".") ? extension.slice(1) : extension;

  const languageMap: Record<string, string> = {
    // File extensions
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    html: "html",
    css: "css",
    scss: "scss",
    py: "python",
    java: "java",
    rb: "ruby",
    php: "php",
    go: "go",
    rust: "rust",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
    sql: "sql",
    sh: "bash",

    // Language names
    javascript: "javascript",
    python: "python",
    typescript: "typescript",
    ruby: "ruby",
    bash: "bash",
    shell: "bash",
  };

  return languageMap[lang.toLowerCase()] || "plaintext";
};

export function CodeHighlighter({ code, extension }: CodeHighlighterProps) {
  return (
    <Highlight
      theme={themes.nightOwl}
      code={code.trim()}
      language={getLanguage(extension)}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 overflow-x-auto custom-scrollbar`}
          style={{ ...style, background: "#011627" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="inline-block w-8 mr-4 text-gray-500 text-right select-none">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
