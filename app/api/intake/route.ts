import { NextResponse } from 'next/server';

/**
 * SKU / layout intake. Multipart in (company, city, robot, sku CSV,
 * optional layout PDF, email), forwarded as JSON to INTAKE_WEBHOOK_URL.
 *
 * Without the env var the route answers 503 intake_unconfigured and the
 * form shows the fallback address — it NEVER fakes a success. Browsers
 * posting without JavaScript get a 303 back to the contact page with a
 * fragment (#received / #error) that CSS turns into a visible message.
 */

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROBOTS = ['UR', 'FANUC', 'KUKA', 'ABB', 'other'] as const;
const MAX_SKU_BYTES = 2 * 1024 * 1024;
const MAX_LAYOUT_BYTES = 8 * 1024 * 1024;

type Outcome = { ok: true } | { ok: false; error: string; status: number };

function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('application/json') || request.headers.get('x-requested-with') === 'fetch';
}

function respond(request: Request, lang: string, outcome: Outcome): NextResponse {
  if (wantsJson(request)) {
    return outcome.ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: outcome.error }, { status: outcome.status });
  }
  const base = lang === 'de' ? '/de/contact' : '/contact';
  const url = new URL(outcome.ok ? `${base}#received` : `${base}#error`, request.url);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request): Promise<NextResponse> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }
  const lang = form.get('lang') === 'de' ? 'de' : 'en';

  // Honeypot: humans never see "website".
  if (typeof form.get('website') === 'string' && (form.get('website') as string).trim() !== '') {
    return respond(request, lang, { ok: true });
  }

  const str = (k: string) => (typeof form.get(k) === 'string' ? (form.get(k) as string).trim() : '');
  const company = str('company').slice(0, 200);
  const city = str('city').slice(0, 120);
  const robot = ROBOTS.includes(str('robot') as (typeof ROBOTS)[number]) ? str('robot') : 'other';
  const email = str('email').toLowerCase();
  const sku = form.get('sku');
  const layout = form.get('layout');

  if (!company || !city) return respond(request, lang, { ok: false, error: 'missing_fields', status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 254) return respond(request, lang, { ok: false, error: 'invalid_email', status: 400 });
  if (!(sku instanceof File) || sku.size === 0) return respond(request, lang, { ok: false, error: 'missing_sku', status: 400 });
  if (sku.size > MAX_SKU_BYTES) return respond(request, lang, { ok: false, error: 'sku_too_large', status: 413 });
  if (layout instanceof File && layout.size > MAX_LAYOUT_BYTES) return respond(request, lang, { ok: false, error: 'layout_too_large', status: 413 });

  const webhook = process.env.INTAKE_WEBHOOK_URL;
  if (!webhook) return respond(request, lang, { ok: false, error: 'intake_unconfigured', status: 503 });

  const skuText = await sku.text();
  const layoutB64 = layout instanceof File && layout.size > 0 ? Buffer.from(await layout.arrayBuffer()).toString('base64') : null;

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(process.env.INTAKE_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.INTAKE_WEBHOOK_TOKEN}` } : {}) },
    body: JSON.stringify({
      source: 'engineeringgrimaldi.com',
      receivedAt: new Date().toISOString(),
      lang,
      company,
      city,
      robot,
      email,
      sku: { name: sku.name, size: sku.size, text: skuText },
      layout: layout instanceof File && layout.size > 0 ? { name: layout.name, size: layout.size, type: layout.type, base64: layoutB64 } : null,
    }),
  }).catch(() => null);

  if (!res || !res.ok) return respond(request, lang, { ok: false, error: 'provider_error', status: 502 });
  return respond(request, lang, { ok: true });
}
