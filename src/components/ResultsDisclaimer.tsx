// Shown wherever client results or performance figures appear.
export const RESULTS_DISCLAIMER =
  'Results vary. Past performance is not indicative of future results. Figures come from individual, anonymized client engagements and depend on each business’s market, competition, starting point and budget. RiseRidge does not guarantee specific rankings, traffic, revenue or cost outcomes.';

export function ResultsDisclaimer({
  className = '',
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <p
      className={`text-xs leading-relaxed ${tone === 'dark' ? 'text-on-dark-muted' : 'text-subtle'} ${className}`}
    >
      {RESULTS_DISCLAIMER}
    </p>
  );
}
