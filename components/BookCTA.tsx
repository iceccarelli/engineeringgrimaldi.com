import { CAL_QUERY, CAL_URL } from '@/lib/site';

/**
 * The primary conversion action: a Cal.com booking link with source
 * attribution. Never a mailto. Server component.
 * If NEXT_PUBLIC_CAL_URL is unset, the fallback URL contains REPLACE-ME
 * so the misconfiguration is visible in review, not silent.
 */
export default function BookCTA({
  label,
  variant = 'glow',
}: {
  label: string;
  variant?: 'glow' | 'line';
}) {
  return (
    <a
      className={variant === 'glow' ? 'btn btn-glow' : 'btn btn-line'}
      href={`${CAL_URL}${CAL_QUERY}`}
      rel="noopener noreferrer"
      data-cta="book"
    >
      {label}
    </a>
  );
}
