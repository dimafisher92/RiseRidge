import Link from 'next/link';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const dimensions = { small: 28, default: 36, large: 48 };
  const textSize = { small: 'text-lg', default: 'text-xl', large: 'text-2xl' };
  const h = dimensions[size];

  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="RankPilot Home">
      <svg
        width={h}
        height={h}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D1F3C" />
            <stop offset="100%" stopColor="#14181F" />
          </linearGradient>
        </defs>
        <rect width="72" height="72" rx="18" fill="url(#logo-bg)" />
        <rect width="72" height="72" rx="18" fill="url(#logo-grad)" opacity="0.15" />
        <circle cx="36" cy="36" r="20" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" opacity="0.4" />
        <circle cx="36" cy="36" r="13" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" opacity="0.6" />
        <rect x="22" y="44" width="5" height="8" rx="2" fill="url(#logo-grad)" opacity="0.5" />
        <rect x="30" y="39" width="5" height="13" rx="2" fill="url(#logo-grad)" opacity="0.75" />
        <rect x="38" y="33" width="5" height="19" rx="2" fill="url(#logo-grad)" />
        <path d="M47 20L52 36L47 28L36 24L47 20Z" fill="url(#logo-grad)" />
        <circle cx="36" cy="36" r="3" fill="#00D4FF" />
      </svg>
      <span className={`font-display font-[800] ${textSize[size]} tracking-tight leading-none`}>
        <span className="text-ice">Rank</span>
        <span className="text-gradient-blue-cyan">Pilot</span>
      </span>
    </Link>
  );
}
