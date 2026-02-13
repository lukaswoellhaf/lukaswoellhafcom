import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export interface FrontmatterResult<T = Record<string, unknown>> {
  data: T;
  content: string;
}

export function extractFrontmatter<T>(markdownWithFrontmatter: string): FrontmatterResult<T> {
  // Simple YAML frontmatter extraction
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdownWithFrontmatter.match(frontmatterRegex);

  if (!match) {
    return {
      data: {} as T,
      content: markdownWithFrontmatter,
    };
  }

  const frontmatterText = match[1];
  const content = match[2];

  // Parse YAML-like frontmatter (simple key: value pairs)
  const data = {} as Record<string, unknown>;
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value: unknown = line.substring(colonIndex + 1).trim();

    // Handle arrays
    if (value === '[' || (typeof value === 'string' && value.startsWith('[') && value.endsWith(']'))) {
      // Simple array parsing - remove brackets and parse
      const arrayContent = value.toString().slice(1, -1); // Remove first [ and last ]
      value = arrayContent.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (value === 'null') {
      value = null;
    } else if (typeof value === 'string') {
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
    }

    data[key] = value;
  }

  return {
    data: data as T,
    content,
  };
}

interface MarkdownParseResult {
  reactContent: JSX.Element;
}

export function parseMarkdown(markdown: string): MarkdownParseResult {
  const reactContent = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {markdown}
    </ReactMarkdown>
  );

  return { reactContent };
}
