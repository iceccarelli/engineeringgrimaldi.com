'use client';

/**
 * Language switcher as real links — crawlable, no 404s, no localStorage
 * theater. Computes the alternate URL from the current pathname.
 */

import { usePathname } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

function logicalPath(pathname: string): string {
  if (pathname === '/de') return '/';
  if (pathname.startsWith('/de/')) return pathname.slice(3);
  return pathname;
}

export default function LangSwitcher({ current, label }: { current: Lang; label: string }) {
  const pathname = usePathname() ?? '/';
  const path = logicalPath(pathname);
  const enHref = path || '/';
  const deHref = path === '/' ? '/de' : `/de${path}`;

  return (
    <span className="lang" role="group" aria-label={label}>
      <a className={current === 'en' ? 'on' : ''} href={enHref} hrefLang="en" lang="en">
        English
      </a>
      <a className={current === 'de' ? 'on' : ''} href={deHref} hrefLang="de" lang="de">
        Deutsch
      </a>
    </span>
  );
}
