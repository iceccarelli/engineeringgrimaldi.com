import type { Lang } from '@/lib/i18n';
import { STATUS_META, type Status } from '@/lib/status';

/**
 * One badge, one vocabulary (lib/status.ts). The label cannot be
 * overridden per page — only the `note` may add a version or a scope
 * ("optimizer v0.2", "grid-droop model"), never a softer word.
 */
export default function StatusBadge({
  status,
  lang,
  note,
  size = 'md',
}: {
  status: Status;
  lang: Lang;
  note?: string;
  size?: 'sm' | 'md';
}) {
  const meta = STATUS_META[status];
  return (
    <span className={`sbadge sbadge-${meta.tone} sbadge-${size}`} title={meta.hint[lang]}>
      <span className="sbadge-dot" aria-hidden="true" />
      <span className="sbadge-label">{meta.label[lang]}</span>
      {note ? <span className="sbadge-note">· {note}</span> : null}
    </span>
  );
}
