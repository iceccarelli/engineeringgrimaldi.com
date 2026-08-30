'use client';

/**
 * Waitlist form — posts to /api/waitlist, JSON in/out, no mailto.
 * States: idle → submitting → ok | error. Honeypot field for bots.
 */

import { useState, type FormEvent } from 'react';
import type { Dict } from '@/lib/dict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Phase = 'idle' | 'submitting' | 'ok' | 'error';

export default function WaitlistForm({ t }: { t: Pick<
  Dict,
  | 'wlEmailLabel'
  | 'wlInterestLabel'
  | 'wlInterestPalletizer'
  | 'wlInterestFloorforge'
  | 'wlInterestHvLab'
  | 'wlSubmit'
  | 'wlOk'
  | 'wlErrEmail'
  | 'wlErrServer'
  | 'wlErrUnconfigured'
  | 'wlPrivacy'
> }) {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<'palletizer' | 'floorforge' | 'hv-lab'>('palletizer');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trap = (new FormData(event.currentTarget).get('company') as string | null) ?? '';
    setError('');
    if (!EMAIL_RE.test(email)) {
      setError(t.wlErrEmail);
      setPhase('error');
      return;
    }
    setPhase('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interest, company: trap }),
      });
      if (res.ok) {
        setPhase('ok');
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error === 'waitlist_unconfigured' ? t.wlErrUnconfigured : t.wlErrServer);
      setPhase('error');
    } catch {
      setError(t.wlErrServer);
      setPhase('error');
    }
  }

  if (phase === 'ok') {
    return <p className="wl-ok" role="status">{t.wlOk}</p>;
  }

  return (
    <form className="wl-form" onSubmit={onSubmit} noValidate>
      <label className="wl-field">
        <span>{t.wlEmailLabel}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="wl-field">
        <span>{t.wlInterestLabel}</span>
        <select
          name="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value as typeof interest)}
        >
          <option value="palletizer">{t.wlInterestPalletizer}</option>
          <option value="floorforge">{t.wlInterestFloorforge}</option>
          <option value="hv-lab">{t.wlInterestHvLab}</option>
        </select>
      </label>
      {/* Honeypot — hidden from humans, filled by naive bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="wl-honeypot"
      />
      <button className="btn btn-glow" type="submit" disabled={phase === 'submitting'}>
        {t.wlSubmit}
      </button>
      {phase === 'error' && error ? <p className="wl-error" role="alert">{error}</p> : null}
      <p className="wl-privacy">{t.wlPrivacy}</p>
    </form>
  );
}
