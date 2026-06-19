import Link from 'next/link';

export function Logo({
  size = 'default',
  onDark = false,
}: {
  size?: 'small' | 'default' | 'large';
  onDark?: boolean;
}) {
  const scale: Record<string, { box: number; mono: number; word: string }> = {
    small: { box: 30, mono: 18, word: 'text-base' },
    default: { box: 36, mono: 22, word: 'text-lg' },
    large: { box: 44, mono: 28, word: 'text-xl' },
  };
  const s = scale[size];
  const wordColor = onDark ? 'text-on-dark' : 'text-ink';
  const boxBorder = onDark ? 'border-brass/70' : 'border-ink/15';

  return (
    <Link href="/" aria-label="RiseRidge Home" className="inline-flex items-center gap-2.5 group">
      {/* RR monogram */}
      <span
        className={`inline-flex items-center justify-center rounded-[5px] border ${boxBorder} bg-transparent`}
        style={{ width: s.box, height: s.box }}
        aria-hidden="true"
      >
        <span
          className="font-display font-bold leading-none flex items-end"
          style={{ fontSize: s.mono }}
        >
          <span className="text-forest" style={{ marginRight: '-0.30em' }}>R</span>
          <span className="text-brass">R</span>
        </span>
      </span>
      {/* Wordmark */}
      <span className={`font-display font-semibold tracking-tight ${s.word} ${wordColor}`}>
        RISE<span className="text-brass">RIDGE</span>
      </span>
    </Link>
  );
}
