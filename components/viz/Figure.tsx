import type { ReactNode } from 'react';
import { VIZ, type Tier } from '@/lib/viz';

/**
 * Every chart on the site sits in this frame: a title that names what is
 * plotted, the SVG, a legend when more than one tier is shown, and the
 * source/as-of line. The legend is the identity channel; colour is not
 * relied on alone.
 */
export default function Figure({
  title, caption, legend, children, wide,
}: { title: string; caption?: string; legend?: { tier: Tier; label: string }[]; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={wide ? 'viz viz-wide' : 'viz'}>
      <figcaption>
        <b>{title}</b>
        {legend && legend.length > 1 && (
          <span className="viz-legend" aria-label="legend">
            {legend.map((l) => (
              <span key={l.tier + l.label}><i style={{ background: VIZ[l.tier] }} aria-hidden="true" />{l.label}</span>
            ))}
          </span>
        )}
      </figcaption>
      <div className="viz-plot">{children}</div>
      {caption && <p className="viz-caption">{caption}</p>}
    </figure>
  );
}
