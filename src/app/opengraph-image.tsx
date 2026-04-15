import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ArcWave — AI-Driven SEO. Measurable Growth.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#060E18',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* AW mark as inline SVG — satori supports basic SVG */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A letterform */}
          <path
            d="M 6 66 L 22 6 L 38 66"
            stroke="#2563EB"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="14" y1="40" x2="30" y2="40"
            stroke="#2563EB"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* W letterform */}
          <path
            d="M 38 66 L 49 18 L 56 44 L 64 10 L 70 66"
            stroke="#06C8D4"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 72,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          ArcWave
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#6B7280',
            fontSize: 28,
            letterSpacing: '0.06em',
            marginTop: -8,
          }}
        >
          AI-Driven SEO. Measurable Growth.
        </div>
      </div>
    ),
    { ...size },
  );
}
