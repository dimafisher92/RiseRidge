import Link from 'next/link';
import Image from 'next/image';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const heights: Record<string, number> = { small: 22, default: 28, large: 38 };
  const h = heights[size];

  return (
    <Link href="/" aria-label="ArcWave Home">
      <Image
        src="/logos/logo-horizontal.png"
        alt="ArcWave"
        width={1040}
        height={128}
        style={{ height: `${h}px`, width: 'auto', display: 'block' }}
        priority={size === 'default'}
      />
    </Link>
  );
}
