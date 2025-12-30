import { useMemo } from 'react';
import katex from 'katex';
import 'katex/contrib/mhchem/mhchem.js'; // Enable \ce{} for chemistry
import DOMPurify from 'dompurify';

interface KaTeXRendererProps {
  content: string;
  displayMode?: boolean;
  className?: string;
}

// Configure DOMPurify to allow KaTeX elements
const purifyConfig = {
  ADD_TAGS: ['semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'mroot', 'msqrt', 'mover', 'munder', 'munderover', 'mtable', 'mtr', 'mtd', 'mtext', 'annotation'],
  ADD_ATTR: ['xmlns', 'encoding', 'mathvariant', 'fence', 'separator', 'stretchy', 'symmetric', 'lspace', 'rspace', 'minsize', 'maxsize', 'accent', 'accentunder', 'columnalign', 'rowalign', 'columnspacing', 'rowspacing', 'columnlines', 'rowlines', 'frame', 'framespacing', 'displaystyle', 'scriptlevel'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
};

// Check if formula should be inline (short, no complex commands)
function shouldBeInline(content: string): boolean {
  // Complex commands that need block display
  const blockCommands = [
    '\\\\',           // line break
    '\\begin',        // environments
    '\\end',
    '\\frac{',        // fractions (complex)
    '\\sum',
    '\\int',
    '\\prod',
    '\\lim',
    '\\matrix',
    '\\array',
  ];
  
  // Check for block commands
  for (const cmd of blockCommands) {
    if (content.includes(cmd)) {
      return false;
    }
  }
  
  // Short formulas and \ce{} chemistry should be inline
  // \ce{} is always inline-friendly
  if (content.includes('\\ce{')) {
    return true;
  }
  
  // Short formulas (< 50 chars) are inline
  return content.length < 50;
}

export function KaTeXRenderer({ content, displayMode = false, className = '' }: KaTeXRendererProps) {
  const html = useMemo(() => {
    try {
      // Auto-detect: force inline for simple formulas
      const useDisplayMode = displayMode && !shouldBeInline(content);
      
      const rendered = katex.renderToString(content, {
        displayMode: useDisplayMode,
        throwOnError: false,
        trust: false,
        strict: 'warn',
        maxSize: 500,
        maxExpand: 1000,
      });
      return DOMPurify.sanitize(rendered, purifyConfig);
    } catch (error) {
      return DOMPurify.sanitize(content);
    }
  }, [content, displayMode]);

  // Use span for inline consistency
  return (
    <span
      className={`katex-inline ${className}`}
      style={{ verticalAlign: 'baseline', display: 'inline' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Utility to parse text with LaTeX blocks - auto-convert short $$ to $
export function parseLatexContent(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match both $$...$$ (block) and $...$ (inline)
  const regex = /\$\$([\s\S]*?)\$\$|\$((?!\$)[^$]*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Determine if it was $$ or $
    const isBlockSyntax = match[1] !== undefined;
    const latex = (match[1] || match[2]).trim();
    
    // Auto-convert: use inline for short/simple formulas even if written as $$
    const forceInline = shouldBeInline(latex);
    
    parts.push(
      <KaTeXRenderer
        key={match.index}
        content={latex}
        displayMode={isBlockSyntax && !forceInline}
      />
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// Component that renders text with embedded LaTeX
export function ContentWithLatex({ content, className = '' }: { content: string; className?: string }) {
  const parsed = useMemo(() => parseLatexContent(content), [content]);
  
  return <span className={`content-latex ${className}`}>{parsed}</span>;
}
