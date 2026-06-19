import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1E3A2E',
          fontSize: 116,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
        }}
      >
        <span style={{ color: '#F4F0E8' }}>R</span>
        <span style={{ color: '#A9874E', marginLeft: -36 }}>R</span>
      </div>
    ),
    size,
  );
}
