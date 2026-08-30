'use client';

import { useEffect, useRef, useState } from 'react';

export type ScopeLabels = {
  phases: string;
  freq: string;
  rocof: string;
  load: string;
  inertia: string;
};

/**
 * The signature instrument of the hardware surface: a three-phase
 * oscilloscope driving a REAL frequency-droop model.
 *
 *   Δf = -f_n · droop · ΔP        (4 % droop, the European convention)
 *   |df/dt| ≤ f_n · ΔP / (2H)     (RoCoF bounded by system inertia)
 *
 * Drag the load above generation and the frequency sags at a rate set by
 * the inertia constant H — exactly the physics a synchronous grid obeys,
 * and the reason low-inertia grids need the fast hardware this site is
 * about. No faked curves: the readouts come out of the integrator.
 */

const F_NOM = 50;
const DROOP = 0.04;
const PHASE_COLORS = ['#3ef58f', '#38bdf8', '#f5b83e'];

export default function Oscilloscope({ labels }: { labels: ScopeLabels }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [load, setLoad] = useState(1.0); // per-unit, generation = 1.0
  const [inertia, setInertia] = useState(4); // seconds
  const [freq, setFreq] = useState(F_NOM);
  const [rocof, setRocof] = useState(0);

  const stateRef = useRef({ f: F_NOM, phase: 0, load: 1.0, h: 4 });
  stateRef.current.load = load;
  stateRef.current.h = inertia;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let readoutAt = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = 340 * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = stateRef.current;

      // Droop target and inertia-bounded slew — the honest dynamics.
      const target = F_NOM * (1 - DROOP * (s.load - 1));
      const maxRocof = (F_NOM * Math.abs(s.load - 1 || 0.001)) / (2 * s.h);
      const step = Math.max(-maxRocof * dt, Math.min(maxRocof * dt, target - s.f));
      const rocofNow = step / (dt || 1e-6);
      s.f += step;
      s.phase += 2 * Math.PI * s.f * dt;

      if (now - readoutAt > 120) {
        readoutAt = now;
        setFreq(s.f);
        setRocof(rocofNow);
      }

      const w = canvas.width / 2;
      const h = 340;
      ctx.clearRect(0, 0, w, h);

      // Phosphor grid
      ctx.strokeStyle = 'rgba(62, 245, 143, 0.10)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += w / 12) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += h / 8) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(62, 245, 143, 0.22)';
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

      // Three phases, 120° apart. Window shows 3 cycles at nominal.
      const cycles = 3 * (s.f / F_NOM);
      const amp = h * 0.36;
      for (let p = 0; p < 3; p++) {
        ctx.strokeStyle = PHASE_COLORS[p];
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = PHASE_COLORS[p];
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const theta = s.phase + (x / w) * 2 * Math.PI * cycles + (p * 2 * Math.PI) / 3;
          const y = h / 2 - Math.sin(theta) * amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const off = Math.abs(freq - F_NOM);
  const freqTone = off < 0.05 ? 'ok' : off < 0.2 ? 'warn' : 'alarm';

  return (
    <div className="scope">
      <div className="scope-screen">
        <canvas ref={canvasRef} aria-label={labels.phases} />
        <div className="scope-readouts" aria-live="polite">
          <div className={`scope-readout scope-${freqTone}`}>
            <span>{labels.freq}</span>
            <strong>{freq.toFixed(3)} Hz</strong>
          </div>
          <div className="scope-readout">
            <span>{labels.rocof}</span>
            <strong>{(rocof * 1000).toFixed(0)} mHz/s</strong>
          </div>
        </div>
      </div>

      <div className="scope-controls">
        <label>
          <span>{labels.load} — {(load * 100).toFixed(0)} %</span>
          <input
            type="range" min={0.6} max={1.4} step={0.01} value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
          />
        </label>
        <label>
          <span>{labels.inertia} — {inertia.toFixed(1)} s</span>
          <input
            type="range" min={1.5} max={8} step={0.1} value={inertia}
            onChange={(e) => setInertia(Number(e.target.value))}
          />
        </label>
      </div>
      <p className="scope-caption">{labels.phases} · Δf = −f·0.04·ΔP · |df/dt| ≤ f·ΔP/2H</p>
    </div>
  );
}
