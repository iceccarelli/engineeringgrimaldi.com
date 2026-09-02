import { ImageResponse } from 'next/og';

/** 1200×630 OG image, generated at the edge — no binary asset to maintain. */

export const runtime = 'edge';
export const alt = 'Grimaldi Engineering — mixed-SKU palletizing software, Frankfurt';
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
          background: '#F6F7F4',
          color: '#12151A',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#5C6570',
          }}
        >
          PALLETIZING SOFTWARE · FRANKFURT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
            Mixed-SKU palletizing software for the robot you already have.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#5C6570', lineHeight: 1.3 }}>
            software shipped · cell not commissioned
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: '#5C6570',
          }}
        >
          <div style={{ display: 'flex' }}>engineeringgrimaldi.com</div>
          <div style={{ display: 'flex', color: '#FF8A00' }}>Grimaldi Engineering</div>
        </div>
      </div>
    ),
    size,
  );
}
