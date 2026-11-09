'use client';

/**
 * Energy intake: the five discovery questions, an organisation, a role
 * and an email. Posts multipart to /api/intake with cluster=energy; the
 * same webhook receives it, tagged. Works without JavaScript (native post,
 * 303 back to /energy/customers#received or #error) and with it.
 *
 * Nothing here asks "would you use this?". Every field is one of the
 * five questions the mandate allows, or the minimum needed to reply.
 */

import { useState, type FormEvent } from 'react';
import { CONTACT_EMAIL, INTAKE_PATH } from '@/lib/site';

export type EnergyIntakeLabels = {
  org: string; role: string; segment: string; segments: [string, string][];
  costs: string; costsHint: string; band: string; bands: [string, string][];
  owner: string; current: string; worth: string; email: string;
  submit: string; sending: string; ok: string;
  errGeneric: string; errUnconfigured: string; errEmail: string; errFields: string; privacy: string;
};

type Phase = 'idle' | 'submitting' | 'ok' | 'error';

export default function EnergyIntakeForm({ labels, lang }: { labels: EnergyIntakeLabels; lang: 'en' | 'de' }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(''); setPhase('submitting');
    try {
      const res = await fetch(INTAKE_PATH, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json', 'X-Requested-With': 'fetch' } });
      if (res.ok) { setPhase('ok'); form.reset(); return; }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      const code = body?.error ?? '';
      setError(code === 'intake_unconfigured' ? labels.errUnconfigured : code === 'invalid_email' ? labels.errEmail : code === 'missing_fields' ? labels.errFields : labels.errGeneric);
      setPhase('error');
    } catch { setError(labels.errGeneric); setPhase('error'); }
  }

  return (
    <form className="intake" action={INTAKE_PATH} method="post" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="cluster" value="energy" />
      <input type="hidden" name="return" value="/energy/customers" />
      <div className="intake-grid">
        <label><span>{labels.org}</span><input type="text" name="company" required maxLength={200} autoComplete="organization" /></label>
        <label><span>{labels.role}</span><input type="text" name="role" required maxLength={120} autoComplete="organization-title" /></label>
        <label><span>{labels.segment}</span>
          <select name="segment" defaultValue="stadtwerke">{labels.segments.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </label>
        <label><span>{labels.email}</span><input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
        <label className="wide"><span>{labels.costs}</span><textarea name="costs" required maxLength={1000} rows={3} placeholder={labels.costsHint} /></label>
        <label><span>{labels.band}</span>
          <select name="band" defaultValue="unknown">{labels.bands.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </label>
        <label><span>{labels.owner}</span><input type="text" name="owner" maxLength={200} /></label>
        <label className="wide"><span>{labels.current}</span><input type="text" name="current" maxLength={300} /></label>
        <label className="wide"><span>{labels.worth}</span><input type="text" name="worth" maxLength={300} /></label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="wl-honeypot" />
      </div>
      <div className="cta-row" style={{ marginBottom: 0, marginTop: 16 }}>
        <button className="btn btn-signal" type="submit" disabled={phase === 'submitting'}>{phase === 'submitting' ? labels.sending : labels.submit}</button>
        {phase === 'ok' && <p className="intake-ok" role="status">{labels.ok}</p>}
        {phase === 'error' && <p className="intake-err" role="alert">{error} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>}
      </div>
      <p className="intake-note">{labels.privacy}</p>
    </form>
  );
}
