'use client';

/**
 * Site header on the AWS pattern: a thin utility bar, a persistent brand,
 * six stable top-level sections with a grouped mega-menu on pointer
 * devices, and a real drawer on small screens.
 *
 * The drawer is the important part. Before this component the navigation
 * was simply hidden below 980 px, which left phone visitors with a logo
 * and one button. Every section and every item is now reachable on every
 * viewport, by keyboard, without JavaScript for the links themselves —
 * each section header is a real link to its index page, so the menu is
 * an enhancement rather than the only route in.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import BrandMark from './BrandMark';
import LangSwitcher from './LangSwitcher';
import { NAV } from '@/lib/nav';
import { langHref, type Lang } from '@/lib/i18n';

export type HeaderLabels = {
  brandTag: string;
  book: string;
  menu: string;
  close: string;
  langLabel: string;
  about: string;
  skipToContent: string;
  primaryNav: string;
};

export default function SiteHeader({ lang, labels }: { lang: Lang; labels: HeaderLabels }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const href = (path: string) => langHref(lang, path);

  // Close everything on navigation.
  useEffect(() => {
    setOpenSection(null);
    setDrawerOpen(false);
    setDrawerSection(null);
  }, [pathname]);

  // Escape closes; click outside closes the mega-menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSection(null);
        setDrawerOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenSection(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const isCurrent = (path: string) => {
    const here = pathname ?? '/';
    const target = href(path);
    return here === target || here.startsWith(`${target}/`);
  };

  return (
    <>
      <a className="skip-link" href="#main">{labels.skipToContent}</a>

      <div className="utility">
        <div className="utility-in">
          <LangSwitcher current={lang} label={labels.langLabel} />
          <a href={href('/about')}>{labels.about}</a>
          <a href="https://igrimaldi.engineering">igrimaldi.engineering</a>
          <a href="https://grimaldi.ca">grimaldi.ca</a>
          <a href="https://github.com/iceccarelli" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <header className="masthead">
        <div className="masthead-in">
          <a className="brand" href={href('/')}>
            <BrandMark size={36} />
            <span>
              <b>Grimaldi Engineering</b>
              <small>{labels.brandTag}</small>
            </span>
          </a>

          <nav className="mega" ref={navRef} aria-label={labels.primaryNav}>
            <ul className="mega-bar">
              {NAV.map((section) => (
                <li
                  key={section.id}
                  className="mega-item"
                  onMouseEnter={() => setOpenSection(section.id)}
                  onMouseLeave={() => setOpenSection(null)}
                >
                  <a
                    href={href(section.path)}
                    className={isCurrent(section.path) ? 'mega-trigger on' : 'mega-trigger'}
                    aria-expanded={openSection === section.id}
                    aria-current={isCurrent(section.path) ? 'page' : undefined}
                    onFocus={() => setOpenSection(section.id)}
                  >
                    {section.label[lang]}
                  </a>

                  {section.groups.length > 0 && openSection === section.id && (
                    <div className="mega-panel">
                      <p className="mega-blurb">{section.blurb[lang]}</p>
                      <div className="mega-groups">
                        {section.groups.map((group) => (
                          <div className="mega-group" key={group.label.en}>
                            <h3>{group.label[lang]}</h3>
                            <ul>
                              {group.items.map((item) => (
                                <li key={item.path}>
                                  <a href={href(item.path)}>
                                    <strong>{item.label[lang]}</strong>
                                    <span>{item.blurb[lang]}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <a className="mega-all" href={href(section.path)}>
                        {section.label[lang]} →
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="masthead-actions">
            <a className="pill" href={href('/book')}>{labels.book}</a>
            <button
              type="button"
              className="drawer-toggle"
              aria-expanded={drawerOpen}
              aria-controls="site-drawer"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span className="sr-only">{drawerOpen ? labels.close : labels.menu}</span>
              <span aria-hidden="true" className={drawerOpen ? 'burger open' : 'burger'}>
                <i /><i /><i />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — every section and item, nothing hidden. */}
      <div
        id="site-drawer"
        className={drawerOpen ? 'drawer drawer-open' : 'drawer'}
        hidden={!drawerOpen}
      >
        <nav aria-label={labels.primaryNav}>
          {NAV.map((section) => {
            const expanded = drawerSection === section.id;
            return (
              <div className="drawer-section" key={section.id}>
                <div className="drawer-row">
                  <a href={href(section.path)} className="drawer-link">{section.label[lang]}</a>
                  {section.groups.some((g) => g.items.length > 0) && (
                    <button
                      type="button"
                      className="drawer-expand"
                      aria-expanded={expanded}
                      onClick={() => setDrawerSection(expanded ? null : section.id)}
                    >
                      <span className="sr-only">{section.label[lang]}</span>
                      <span aria-hidden="true">{expanded ? '−' : '+'}</span>
                    </button>
                  )}
                </div>
                {expanded && (
                  <div className="drawer-children">
                    {section.groups.map((group) => (
                      <div key={group.label.en}>
                        <h4>{group.label[lang]}</h4>
                        <ul>
                          {group.items.map((item) => (
                            <li key={item.path}>
                              <a href={href(item.path)}>{item.label[lang]}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a className="btn btn-glow drawer-cta" href={href('/book')}>{labels.book}</a>
        </nav>
      </div>
      {drawerOpen && <div className="drawer-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}
    </>
  );
}
