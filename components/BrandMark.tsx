/**
 * BrandMark — the Grimaldi mark as inline SVG: V+G in round-capped
 * strokes on an ink tile, signed with a single --signal stroke. Same
 * artwork ships as app/icon.svg and favicon.svg. Server component.
 */

export default function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Grimaldi Engineering"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect x="2" y="2" width="92" height="92" rx="8" fill="#12151A" />
      <path d="M 24 28 L 37 58 L 50 28" fill="none" stroke="#F6F7F4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 77.3 34.7 A 16 16 0 1 0 82 46 L 69 46" fill="none" stroke="#F6F7F4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 22 76 H 74" fill="none" stroke="#FF8A00" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
