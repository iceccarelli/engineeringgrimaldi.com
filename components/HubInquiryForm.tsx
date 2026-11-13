"use client";
import { useState, type FormEvent } from "react";
import type { Lang } from "@/lib/i18n";
import { CONTACT_EMAIL, INTAKE_PATH } from "@/lib/site";
export default function HubInquiryForm({ lang }: { lang: Lang }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fallback">("idle");
  const de = lang === "de";
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const fd = new FormData(e.currentTarget);
    try { const r = await fetch(INTAKE_PATH, { method: "POST", headers: { accept: "application/json" }, body: fd }); setState(r.ok ? "ok" : "fallback"); }
    catch { setState("fallback"); }
  }
  return (
    <form className="intake" method="POST" action={INTAKE_PATH} onSubmit={onSubmit}>
      <input type="hidden" name="lang" value={lang} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="wl-honeypot" aria-hidden="true" />
      <div className="intake-grid">
        <label><span>{de ? "Unternehmen / Zielbereich" : "Company / Target"}</span>
          <select name="companyTarget" defaultValue="time-to-power">
            <option value="time-to-power">Time to Power (Gridforge) — timetopower.ai</option>
            <option value="neuralbridge">NeuralBridge — neuralbridge.io</option>
            <option value="hub">{de ? "Grimaldi Engineering — Allgemein" : "Grimaldi Engineering — General"}</option>
          </select>
        </label>
        <label><span>Name</span><input type="text" name="name" required maxLength={120} /></label>
        <label><span>Organisation</span><input type="text" name="organisation" required maxLength={160} /></label>
        <label><span>{de ? "Geschäftliche E-Mail" : "Work Email"}</span><input type="email" name="email" required maxLength={200} /></label>
        <label className="wide"><span>{de ? "Technischer Kontext / Pilotanfrage" : "Technical Context / Pilot Scope"}</span>
          <textarea name="message" rows={4} required maxLength={2000} />
        </label>
      </div>
      <div className="cta-row" style={{ marginTop: 16, marginBottom: 0 }}>
        <button className="btn btn-signal" type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : (de ? "Anfrage senden" : "Send inquiry")}</button>
      </div>
      {state === "ok" && <p className="intake-ok" style={{ marginTop: 12 }}>{de ? "Anfrage eingegangen." : "Inquiry received."}</p>}
      {state === "fallback" && <p className="intake-note" style={{ marginTop: 12 }}>{de ? "Direkter E-Mail-Kontakt: " : "Direct email path: "}<a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>}
    </form>
  );
}
