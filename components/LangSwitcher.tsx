"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { langHref, type Lang } from "@/lib/i18n";
export default function LangSwitcher({ current, label }: { current: Lang; label: string }) {
  const pathname = usePathname() ?? "/";
  const logical = pathname.replace(/^\/de(?=\/|$)/, "") || "/";
  return (
    <span className="lang-switch" aria-label={label}>
      <Link href={langHref("en", logical)} aria-current={current === "en" ? "true" : undefined}>EN</Link>
      <span> / </span>
      <Link href={langHref("de", logical)} aria-current={current === "de" ? "true" : undefined}>DE</Link>
    </span>
  );
}
