/**
 * Standard Vercel serverless output (was `output: 'export'`).
 * The static export had to go: the waitlist route handler (POST) and
 * middleware-based locale routing are impossible in a static export.
 * All marketing pages still prerender via generateStaticParams, so
 * crawlers get full HTML with zero JavaScript — nothing is lost.
 * Security headers and the www→apex redirect live in vercel.json.
 * (Next 14 does not support next.config.ts — this stays .js.)
 */
/** Short alias routes from the IA brief and the old palletizer URL, both
 *  locales. Permanent, so old links and the brief's paths both resolve. */
const ALIASES = [
  ['/forge/palletizer', '/palletizer'],
  ['/forge/floor', '/forge/floorforge'],
  ['/forge/paint', '/forge/paintforge'],
  ['/forge/dry', '/forge/dryforge'],
  ['/disciplines/hv', '/disciplines/high-voltage'],
  ['/disciplines/power', '/disciplines/power-electronics'],
];

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return ALIASES.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `/de${from}`, destination: `/de${to}`, permanent: true },
    ]);
  },
};
