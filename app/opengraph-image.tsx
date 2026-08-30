import { ImageResponse } from 'next/og';

/** 1200×630 OG image, generated at the edge — no binary asset to maintain. */

export const runtime = 'edge';
export const alt = 'Grimaldi Engineering — Forge Line, high-voltage build logs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(160deg, #0a1018 0%, #070b10 70%)',
          color: '#e8f0f6',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#3ef58f',
          }}
        >
          Grimaldi Engineering · Frankfurt
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            The Forge Line
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#9fb1c1', lineHeight: 1.3 }}>
            Palletizer OS · FloorForge · High-voltage build logs
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: '#6e8093',
          }}
        >
          <div style={{ display: 'flex' }}>engineeringgrimaldi.com</div>
          <div style={{ display: 'flex', color: '#3ef58f' }}>Vincenzo Ceccarelli Grimaldi</div>
        </div>
      </div>
    ),
    size,
  );
}
