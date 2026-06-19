import Link from 'next/link';
import Image from 'next/image';

export function Logo({
  size = 'default',
  onDark = false,
}: {
  size?: 'small' | 'default' | 'large';
  onDark?: boolean;
}) {
  const scale: Record<string, { box: number; word: string }> = {
    small: { box: 30, word: 'text-base' },
    default: { box: 36, word: 'text-lg' },
    large: { box: 44, word: 'text-xl' },
  };
  const s = scale[size];
  const wordColor = onDark ? 'text-on-dark' : 'text-ink';
  const boxBorder = onDark ? 'border-brass/70' : 'border-ink/15';
  const monogram = onDark
    ? '/logos/riseridge/png/monogram-white.png'
    : '/logos/riseridge/png/monogram-fullcolor.png';

  return (
    <Link href="/" aria-label="RiseRidge Home" className="inline-flex items-center gap-2.5 group">
      {/* RR monogram (official mark) in the brand box */}
      <span
        className={`inline-flex items-center justify-center rounded-[5px] border ${boxBorder} bg-transparent p-1.5`}
        style={{ width: s.box, height: s.box }}
      >
        <Image
          src={monogram}
          alt="RiseRidge"
          width={566}
          height={369}
          className="h-full w-auto object-contain"
          priority={size !== 'small'}
        />
      </span>
      {/* Wordmark in Cormorant (matches the official wordmark asset) */}
      <span className={`font-display font-semibold tracking-tight ${s.word} ${wordColor}`}>
        RISE<span className="text-brass">RIDGE</span>
      </span>
    </Link>
  );
}
