import { ImageResponse } from 'next/og';

/**
 * Per-page social card.
 *
 * LinkedIn, X and Slack all render the OG image before anyone reads the
 * title, so a shared calculator that previews as "The Forge" wastes
 * the click. This endpoint draws the actual page title at 1200×630 in
 * the site's own palette. Query: ?t=<title>&k=<kicker>.
 *
 * Titles are truncated rather than allowed to overflow, and nothing from
 * the query string is interpreted as markup — it is drawn as text.
 */

export const runtime = 'edge';

const MAX_TITLE = 110;
const MAX_KICKER = 60;

export function GET(request: Request): ImageResponse {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get('t') ?? 'Grimaldi Engineering';
  const rawKicker = searchParams.get('k') ?? 'Palletizing software · Frankfurt';

  const title = rawTitle.slice(0, MAX_TITLE);
  const kicker = rawKicker.slice(0, MAX_KICKER);
  const size = title.length > 70 ? 52 : title.length > 45 ? 62 : 72;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 14, height: 44, background: '#FF8A00', borderRadius: 2 }} />
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', color: '#5C6570' }}>
            {kicker}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: size, fontWeight: 700, lineHeight: 1.12, maxWidth: 1000 }}>
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 25,
            color: '#5C6570',
            borderTop: '1px solid #D7DCD6',
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex' }}>engineeringgrimaldi.com</div>
          <div style={{ display: 'flex', color: '#12151A' }}>Grimaldi Engineering</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
