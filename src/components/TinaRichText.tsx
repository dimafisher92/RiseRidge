'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { TinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text';

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: Record<string, (props: any) => JSX.Element | null> = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-display font-semibold text-2xl text-ice mt-12 mb-5 leading-snug">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-display font-semibold text-xl text-ice mt-8 mb-3 leading-snug">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="font-display font-semibold text-lg text-ice mt-6 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted leading-relaxed mb-5 text-base">{children}</p>
  ),
  a: ({ children, url }: { children?: React.ReactNode; url?: string }) => (
    <a href={url} className="text-electric hover:text-signal underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-outside text-muted space-y-2 mb-6 ml-5 text-sm leading-relaxed">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-outside text-muted space-y-2 mb-6 ml-5 text-sm leading-relaxed">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="pl-1">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-electric pl-6 italic text-muted/80 my-8 text-base leading-relaxed">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="font-mono text-xs bg-navy/80 border border-border rounded px-1.5 py-0.5 text-electric">
      {children}
    </code>
  ),
  code_block: ({ value }: { value?: string }) => (
    <pre className="font-mono text-sm bg-navy border border-border rounded-xl p-6 overflow-x-auto my-8 text-ice">
      <code>{value}</code>
    </pre>
  ),
  bold: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-ice">{children}</strong>
  ),
  italic: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-muted/90">{children}</em>
  ),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

interface TinaRichTextProps {
  content: TinaMarkdownContent;
}

export function TinaRichText({ content }: TinaRichTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TinaMarkdown content={content} components={components as any} />;
}
