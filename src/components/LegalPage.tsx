import fs from 'node:fs';
import path from 'node:path';
import { Markdown } from './Markdown';
import { JsonLd } from './JsonLd';

// Renders a legal document from content/legal/<file>.md at build time.
export function LegalPage({
  title,
  file,
  href,
  lastUpdated,
}: {
  title: string;
  file: string;
  href: string;
  lastUpdated: string;
}) {
  const body = fs.readFileSync(path.join(process.cwd(), 'content', 'legal', file), 'utf8');
  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: title, href },
        ]}
      />
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-6">Legal</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl leading-[1.08] text-ink">{title}</h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-10">
            <Markdown content={body} />
          </div>
        </div>
      </section>
    </>
  );
}
