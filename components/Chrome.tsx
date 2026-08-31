import type { ReactNode } from 'react';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import { getDict } from '@/lib/dict';
import type { Lang } from '@/lib/i18n';

/** Shared chrome: header (with mega-menu + mobile drawer), main, footer. */
export default function Chrome({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = getDict(lang);
  return (
    <>
      <SiteHeader
        lang={lang}
        labels={{
          brandTag: t.brandTag,
          book: t.navBook,
          menu: t.navMenu,
          close: t.navClose,
          langLabel: t.langLabel,
          skipToContent: t.skipToContent,
          primaryNav: t.primaryNav,
        }}
      />
      <div id="main">{children}</div>
      <SiteFooter lang={lang} />
    </>
  );
}
