import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 14,
          fontSize: 42,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
        }}
      >
        <span style={{ color: '#F4F0E8' }}>R</span>
        <span style={{ color: '#A9874E', marginLeft: -13 }}>R</span>
      </div>
    ),
    size,
  );
}
