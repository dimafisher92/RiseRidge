import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'RiseRidge — AI-Driven SEO. Measurable growth.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fetch the Cormorant Garamond TTF from Google Fonts (old-UA trick returns TTF,
// which Satori supports). Falls back to the default font if the fetch fails.
async function loadCormorant(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@${weight}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36' } },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const [monogramData, cormorant600, cormorant500] = await Promise.all([
    readFile(join(process.cwd(), 'public/logos/riseridge/png/monogram-fullcolor.png')).catch(() => null),
    loadCormorant(600),
    loadCormorant(500),
  ]);

  const monogramSrc = monogramData
    ? `data:image/png;base64,${Buffer.from(monogramData).toString('base64')}`
    : null;

  const fonts = [
    cormorant600 && { name: 'Cormorant', data: cormorant600, weight: 600 as const, style: 'normal' as const },
    cormorant500 && { name: 'Cormorant', data: cormorant500, weight: 500 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 500; style: 'normal' }[];

  const serif = fonts.length ? 'Cormorant' : 'serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FBFAF7',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* brass top rule */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: '#A9874E' }} />

        {/* Logo lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 76,
              height: 76,
              border: '2px solid rgba(21,20,15,0.15)',
              borderRadius: 8,
              padding: 12,
            }}
          >
            {monogramSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={monogramSrc} width={52} height={34} alt="" style={{ objectFit: 'contain' }} />
            ) : (
              <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 600, display: 'flex' }}>
                <span style={{ color: '#1E3A2E' }}>R</span>
                <span style={{ color: '#A9874E', marginLeft: -10 }}>R</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', fontFamily: serif, fontSize: 40, fontWeight: 600, letterSpacing: 2 }}>
            <span style={{ color: '#15140F' }}>RISE</span>
            <span style={{ color: '#A9874E' }}>RIDGE</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 22, letterSpacing: 6, color: '#A9874E', marginBottom: 22 }}>
            AI-DRIVEN SEO AGENCY · EST 2020
          </div>
          <div style={{ display: 'flex', fontFamily: serif, fontSize: 92, fontWeight: 600, color: '#15140F', lineHeight: 1.0 }}>
            AI-Driven SEO.
          </div>
          <div style={{ display: 'flex', gap: 24, fontFamily: serif, fontSize: 92, fontWeight: 600, lineHeight: 1.05 }}>
            <span style={{ color: '#15140F' }}>Measurable</span>
            <span style={{ color: '#1E3A2E', fontStyle: 'italic' }}>growth.</span>
          </div>
        </div>

        {/* Footer line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#56514a', fontSize: 26 }}>
          <div style={{ width: 56, height: 3, backgroundColor: '#A9874E' }} />
          AI-powered SEO infrastructure with hands-on strategy — proven in the numbers.
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
