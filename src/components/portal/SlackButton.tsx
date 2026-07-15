import { MessagesSquare } from 'lucide-react';

// "Ask a question in Slack" CTA. Renders nothing when the client has no Slack
// channel URL configured, so it never shows a dead link.
export function SlackButton({
  url,
  label = 'Ask a question in Slack',
  className = '',
}: {
  url: string | null | undefined;
  label?: string;
  className?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`no-print inline-flex items-center gap-2 rounded-full bg-brass px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brass-hover ${className}`}
    >
      <MessagesSquare className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
