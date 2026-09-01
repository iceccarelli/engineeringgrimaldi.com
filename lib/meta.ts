/**
 * Social-card URLs. One helper so every page's preview image is the
 * page's own title rather than a shared default.
 */

import { SITE_URL } from './site';

export function ogUrl(title: string, kicker = 'Grimaldi Engineering · Frankfurt'): string {
  const params = new URLSearchParams({ t: title, k: kicker });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Ready-made openGraph.images / twitter.images array. */
export function ogImages(title: string, kicker?: string) {
  return [{ url: ogUrl(title, kicker), width: 1200, height: 630, alt: title }];
}
