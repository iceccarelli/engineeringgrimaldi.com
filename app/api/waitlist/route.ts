import { NextResponse } from 'next/server';

/**
 * Waitlist endpoint. JSON in, JSON out — replaces every mailto.
 *
 * Provider: Loops (https://loops.so). Set LOOPS_API_KEY in Vercel env and
 * enable double opt-in for the audience in the Loops dashboard.
 * Without the key this endpoint answers 503 waitlist_unconfigured —
 * it NEVER fakes a success.
 */

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTERESTS = ['palletizer', 'floorforge', 'hv-lab'] as const;
type Interest = (typeof INTERESTS)[number];

type Payload = { email?: unknown; interest?: unknown; company?: unknown };

export async function POST(request: Request): Promise<NextResponse> {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: bots fill "company"; humans never see it. Answer 200 with no
  // side effect so the bot learns nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const interest: Interest = INTERESTS.includes(body.interest as Interest)
    ? (body.interest as Interest)
    : 'hv-lab';

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'waitlist_unconfigured' }, { status: 503 });
  }

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      source: 'engineeringgrimaldi.com',
      userGroup: interest,
      subscribed: true,
    }),
  });

  if (res.ok) {
    return NextResponse.json({ ok: true });
  }

  // Loops answers 409 for an existing contact — that is a success for the
  // visitor (they are on the list), not an error to expose.
  if (res.status === 409) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'provider_error' }, { status: 502 });
}
