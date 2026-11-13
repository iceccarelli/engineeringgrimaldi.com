const securityHeaders = [
  {
    "key": "Strict-Transport-Security",
    "value": "max-age=63072000; includeSubDomains; preload"
  },
  {
    "key": "X-Content-Type-Options",
    "value": "nosniff"
  },
  {
    "key": "Referrer-Policy",
    "value": "strict-origin-when-cross-origin"
  },
  {
    "key": "X-Frame-Options",
    "value": "DENY"
  },
  {
    "key": "Permissions-Policy",
    "value": "camera=(), microphone=(), geolocation=()"
  },
  {
    "key": "Content-Security-Policy",
    "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
  }
];
const legacyToRoot = ["palletizer", "forge", "integrators", "solutions", "tools", "pricing", "lab", "work"];
const legacyToFoundation = ["disciplines", "docs", "reference", "resources"];
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() { return [{ source: "/:path*", headers: securityHeaders }]; },
  async redirects() {
    const r = [
      { source: "/book", destination: "/contact", permanent: true },
      { source: "/de/book", destination: "/de/contact", permanent: true },
      { source: "/energy", destination: "/time-to-power", permanent: true },
      { source: "/energy/:path*", destination: "/time-to-power", permanent: true },
      { source: "/de/energy", destination: "/de/time-to-power", permanent: true },
      { source: "/de/energy/:path*", destination: "/de/time-to-power", permanent: true },
      { source: "/api/energy", destination: "/api/hub", permanent: true },
      { source: "/api/energy/:path*", destination: "/api/hub", permanent: true },
    ];
    for (const p of legacyToRoot) {
      r.push({ source: "/" + p, destination: "/", permanent: true }, { source: "/" + p + "/:path*", destination: "/", permanent: true });
      r.push({ source: "/de/" + p, destination: "/de", permanent: true }, { source: "/de/" + p + "/:path*", destination: "/de", permanent: true });
    }
    for (const p of legacyToFoundation) {
      r.push({ source: "/" + p, destination: "/foundation", permanent: true }, { source: "/" + p + "/:path*", destination: "/foundation", permanent: true });
      r.push({ source: "/de/" + p, destination: "/de/foundation", permanent: true }, { source: "/de/" + p + "/:path*", destination: "/de/foundation", permanent: true });
    }
    return r;
  },
};
