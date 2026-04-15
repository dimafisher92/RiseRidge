import Link from 'next/link';
import { useId } from 'react';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const uid = useId().replace(/:/g, '');
  const dimensions = { small: 28, default: 36, large: 48 };
  const textSize = { small: 'text-base', default: 'text-lg', large: 'text-2xl' };
  const h = dimensions[size];

  const gMark = `gm-${uid}`;
  const gHighlight = `gh-${uid}`;

  return (
    <Link href="/" className="flex items-center gap-3" aria-label="ArcWave Home">
      {/* AW ribbon mark — no background box, mark fills the square */}
      <svg
        width={h}
        height={h}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Main gradient: dark navy → mid blue → teal → cyan, left-to-right */}
          <linearGradient id={gMark} x1="4" y1="36" x2="68" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#1A2E78" />
            <stop offset="32%"  stopColor="#2563EB" />
            <stop offset="68%"  stopColor="#0EA5C9" />
            <stop offset="100%" stopColor="#06C8D4" />
          </linearGradient>
          {/* Highlight overlay: lighter edge simulating 3-D ribbon fold */}
          <linearGradient id={gHighlight} x1="4" y1="36" x2="68" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#4A72E8" stopOpacity="0" />
            <stop offset="50%"  stopColor="#60C8E8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#80EEF8" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ── Letter A ── */}
        {/* Left leg + right leg of A, meeting at apex */}
        <path
          d="M 6 66 L 22 6 L 38 66"
          stroke={`url(#${gMark})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* A crossbar */}
        <line
          x1="14" y1="40"
          x2="30" y2="40"
          stroke={`url(#${gMark})`}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* ── Letter W ── (shares bottom-right of A, flows right) */}
        <path
          d="M 38 66 L 49 18 L 56 44 L 64 10 L 70 66"
          stroke={`url(#${gMark})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ribbon highlight — thin bright edge on top of main paths */}
        <path
          d="M 6 66 L 22 6 L 38 66"
          stroke={`url(#${gHighlight})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 38 66 L 49 18 L 56 44 L 64 10 L 70 66"
          stroke={`url(#${gHighlight})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <span
        className={`font-display font-[500] ${textSize[size]} tracking-[0.18em] leading-none text-white uppercase select-none`}
      >
        ArcWave
      </span>
    </Link>
  );
}
