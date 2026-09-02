/**
 * The one conversion action, kept as a component so parked pages keep
 * compiling: an internal link to the SKU/layout intake. No calendar,
 * no external booking service, no mailto. Server component.
 */
export default function BookCTA({
  label,
  variant = 'glow',
  lang = 'en',
}: {
  label: string;
  variant?: 'glow' | 'line';
  lang?: 'en' | 'de';
}) {
  const href = lang === 'de' ? '/de/contact' : '/contact';
  return (
    <a className={variant === 'glow' ? 'btn btn-signal' : 'btn btn-line'} href={href} data-cta="intake">
      {label}
    </a>
  );
}
