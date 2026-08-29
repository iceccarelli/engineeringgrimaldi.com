/**
 * BrandMark — the Grimaldi mark, as inline SVG.
 *
 * Geometric V+G drawn in round-capped strokes on the ink tile, signed with a
 * grid-frequency waveform in the network gradient (violet → sky → emerald):
 * software, hardware and energy in one line. The same artwork ships as the
 * favicon (app/icon.svg) and on every domain of the network, so the identity
 * is a single drawing, not a font choice.
 *
 * Server component — no state, no handlers — so it renders in RSC and client
 * trees alike.
 */

export default function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Vincenzo Grimaldi"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="vgFlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a52f4" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="vgSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#232f3e" />
          <stop offset="1" stopColor="#12192a" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#vgSheen)" />
      <rect x="2" y="2" width="92" height="92" rx="22" fill="none" stroke="#3b465c" strokeWidth="1.5" opacity="0.55" />
      <path d="M 24 28 L 37 58 L 50 28" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 77.3 34.7 A 16 16 0 1 0 82 46 L 69 46" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 22 76 q 6.5 -9 13 0 t 13 0 t 13 0 t 13 0" fill="none" stroke="url(#vgFlow)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}
