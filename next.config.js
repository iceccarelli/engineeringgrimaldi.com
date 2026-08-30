/**
 * Standard Vercel serverless output (was `output: 'export'`).
 * The static export had to go: the waitlist route handler (POST) and
 * middleware-based locale routing are impossible in a static export.
 * All marketing pages still prerender via generateStaticParams, so
 * crawlers get full HTML with zero JavaScript — nothing is lost.
 * Security headers and the www→apex redirect live in vercel.json.
 * (Next 14 does not support next.config.ts — this stays .js.)
 */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
};
