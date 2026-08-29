'use client';

/**
 * Four-locale layer, same contract as igrimaldi.engineering: English is
 * canonical and baked into the prerendered HTML; ES/DE/ZH swap client-side.
 * Locale persists in the shared `vg-locale` key, so a visitor who chose
 * Deutsch on the portfolio lands here in Deutsch.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import strings from './strings.json';

export type Locale = 'en' | 'es' | 'de' | 'zh';

export const locales: { code: Locale; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'es', native: 'Español' },
  { code: 'de', native: 'Deutsch' },
  { code: 'zh', native: '中文' },
];

type Dict = Record<string, string>;
const table = strings as Record<Locale, Dict>;

const STORAGE_KEY = 'vg-locale';

function detect(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (s === 'en' || s === 'es' || s === 'de' || s === 'zh') return s;
  } catch {}
  const n = (navigator.language || 'en').slice(0, 2);
  return n === 'es' || n === 'de' || n === 'zh' ? (n as Locale) : 'en';
}

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string }>({
  locale: 'en',
  setLocale: () => undefined,
  t: (k) => table.en[k] ?? k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => setLocaleState(detect()), []);
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-Hans' : locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback((k: string) => table[locale][k] ?? table.en[k] ?? k, [locale]);

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
