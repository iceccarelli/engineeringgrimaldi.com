import type { MetadataRoute } from "next";
import { langHref } from "@/lib/i18n";
import { allNavPaths } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["/", ...allNavPaths(), "/impressum", "/datenschutz"];
  return paths.flatMap((p) => {
    const languages = { en: SITE_URL + langHref("en", p), de: SITE_URL + langHref("de", p), "x-default": SITE_URL + langHref("en", p) };
    return (["en", "de"] as const).map((l) => ({ url: SITE_URL + langHref(l, p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8, alternates: { languages } }));
  });
}
