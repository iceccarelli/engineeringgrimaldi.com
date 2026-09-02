import { permanentRedirect } from 'next/navigation';
import { isLang, langHref, type Lang } from '@/lib/i18n';

/** /book → the SKU/layout intake. No calendar exists any more. */
export default function BookPage({ params }: { params: { lang: string } }): never {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  permanentRedirect(langHref(lang, '/contact'));
}
