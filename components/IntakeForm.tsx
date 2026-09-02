'use client';

/**
 * The intake: company, city, robot brand, SKU file, optional layout PDF,
 * email. Posts multipart to /api/intake. Works without JavaScript (native
 * form post, 303 back with #received / #error) and with it (fetch, inline
 * state). No calendar, no price, no newsletter checkbox.
 */

import { useState, type FormEvent } from 'react';
import { CONTACT_EMAIL, INTAKE_PATH } from '@/lib/site';

export type IntakeLabels = {
  company: string;
  city: string;
  robot: string;
  robotOther: string;
  sku: string;
  skuHint: string;
  layout: string;
  email: string;
  submit: string;
  sending: string;
  ok: string;
  errGeneric: string;
  errUnconfigured: string;
  errEmail: string;
  errSku: string;
  errSize: string;
  privacy: string;
};

type Phase = 'idle' | 'submitting' | 'ok' | 'error';

export default function IntakeForm({ labels, lang }: { labels: IntakeLabels; lang: 'en' | 'de' }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError('');
    setPhase('submitting');
    try {
      const res = await fetch(INTAKE_PATH, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json', 'X-Requested-With': 'fetch' },
      });
      if (res.ok) { setPhase('ok'); form.reset(); return; }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      const code = body?.error ?? '';
      setError(
        code === 'intake_unconfigured' ? labels.errUnconfigured
          : code === 'invalid_email' ? labels.errEmail
            : code === 'missing_sku' ? labels.errSku
              : code === 'sku_too_large' || code === 'layout_too_large' ? labels.errSize
                : labels.errGeneric,
      );
      setPhase('error');
    } catch {
      setError(labels.errGeneric);
      setPhase('error');
    }
  }

  if (phase === 'ok') {
    return <p className="intake-ok" role="status">{labels.ok}</p>;
  }

  return (
    <form className="intake" action={INTAKE_PATH} method="post" encType="multipart/form-data" onSubmit={onSubmit}>
      <input type="hidden" name="lang" value={lang} />
      <div className="intake-grid">
        <label>
          <span>{labels.company}</span>
          <input type="text" name="company" required maxLength={200} autoComplete="organization" />
        </label>
        <label>
          <span>{labels.city}</span>
          <input type="text" name="city" required maxLength={120} autoComplete="address-level2" />
        </label>
        <label>
          <span>{labels.robot}</span>
          <select name="robot" defaultValue="UR">
            <option value="UR">UR</option>
            <option value="FANUC">FANUC</option>
            <option value="KUKA">KUKA</option>
            <option value="ABB">ABB</option>
            <option value="other">{labels.robotOther}</option>
          </select>
        </label>
        <label>
          <span>{labels.email}</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label className="wide">
          <span>{labels.sku}</span>
          <input type="file" name="sku" required accept=".csv,.txt,text/csv,text/plain" />
          <small className="intake-note">{labels.skuHint}</small>
        </label>
        <label className="wide">
          <span>{labels.layout}</span>
          <input type="file" name="layout" accept=".pdf,application/pdf" />
        </label>
        {/* Honeypot — hidden from humans, filled by naive bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="wl-honeypot" />
      </div>
      <div className="cta-row" style={{ marginBottom: 0, marginTop: 16 }}>
        <button type="submit" className="btn btn-signal" disabled={phase === 'submitting'}>
          {phase === 'submitting' ? labels.sending : labels.submit}
        </button>
      </div>
      {phase === 'error' && error ? (
        <p className="intake-err" role="alert" style={{ marginTop: 16 }}>
          {error} <code>{CONTACT_EMAIL}</code>
        </p>
      ) : null}
      <p className="intake-note">{labels.privacy}</p>
    </form>
  );
}
