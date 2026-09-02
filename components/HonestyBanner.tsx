import type { ReactNode } from 'react';

/**
 * The banner that must sit on any page where an aspiration and a proof
 * claim would otherwise be read together. Red = nothing measured exists;
 * amber = something exists but is not what the surrounding copy might
 * suggest. It is a <p role="note">, not decoration — screen readers get it.
 */
export default function HonestyBanner({
  tone = 'red',
  title,
  children,
}: {
  tone?: 'red' | 'amber';
  title: string;
  children?: ReactNode;
}) {
  return (
    <p className={`honesty honesty-${tone}`} role="note">
      <strong>{title}</strong>
      {children ? <span className="honesty-body">{children}</span> : null}
    </p>
  );
}
