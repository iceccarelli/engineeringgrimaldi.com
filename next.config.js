/**
 * Standard Vercel serverless output (was `output: 'export'`).
 * The static export had to go: the waitlist route handler (POST) and
 * middleware-based locale routing are impossible in a static export.
 * All marketing pages still prerender via generateStaticParams, so
 * crawlers get full HTML with zero JavaScript — nothing is lost.
 * Security headers and the redirects live in vercel.json:
 *   - www.engineeringgrimaldi.com → apex (308)
 *   - palletizer-app.vercel.app/* → https://engineeringgrimaldi.com/palletizer (308)
 *     Inert until that hostname is attached to this Vercel project; the
 *     upstream demo keeps running on its own project until then. The demo
 *     host is never advertised in a heading here.
 *   - /book → /contact, /forge/palletizer → /palletizer (308), mirrored
 *     by permanentRedirect() in the routes for the /de tree.
 * Fonts are self-hosted from /public/fonts (IBM Plex, OFL), so the CSP
 * font-src stays 'self'.
 * (Next 14 does not support next.config.ts — this stays .js.)
 */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
};
