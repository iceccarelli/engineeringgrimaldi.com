import { NextResponse } from "next/server";
export const runtime = "nodejs";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export async function POST(req: Request) {
  let f: FormData;
  try { f = await req.formData(); } catch { return NextResponse.json({ error: "invalid_form" }, { status: 400 }); }
  if (String(f.get("website") ?? "").trim()) return NextResponse.json({ ok: true });
  const companyTarget = String(f.get("companyTarget") ?? "hub").slice(0, 60);
  const name = String(f.get("name") ?? "").trim().slice(0, 120);
  const organisation = String(f.get("organisation") ?? "").trim().slice(0, 160);
  const email = String(f.get("email") ?? "").trim().toLowerCase();
  const message = String(f.get("message") ?? "").trim().slice(0, 2000);
  if (!name || !organisation || !message || !EMAIL_RE.test(email)) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const hook = process.env.INTAKE_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ error: "intake_unconfigured" }, { status: 503 });
  const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.INTAKE_WEBHOOK_TOKEN ? { Authorization: "Bearer " + process.env.INTAKE_WEBHOOK_TOKEN } : {}) }, body: JSON.stringify({ source: "engineeringgrimaldi.com", receivedAt: new Date().toISOString(), companyTarget, name, organisation, email, message }) }).catch(() => null);
  return r && r.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "provider_error" }, { status: 502 });
}
