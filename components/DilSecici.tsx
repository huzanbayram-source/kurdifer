"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALES, localeNames, type Locale } from "@/lib/i18n";

interface Props {
  locale: Locale;
}

function ayniSayfaUrl(yeniLocale: Locale, pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])) {
    segments[0] = yeniLocale;
    return "/" + segments.join("/");
  }
  return `/${yeniLocale}${pathname === "/" ? "" : pathname}`;
}

export function DilSecici({ locale }: Props) {
  const pathname = usePathname() ?? "/";
  const [acik, setAcik] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function tiklamaDisi(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAcik(false);
      }
    }
    function escKapat(e: KeyboardEvent) {
      if (e.key === "Escape") setAcik(false);
    }
    document.addEventListener("mousedown", tiklamaDisi);
    document.addEventListener("keydown", escKapat);
    return () => {
      document.removeEventListener("mousedown", tiklamaDisi);
      document.removeEventListener("keydown", escKapat);
    };
  }, []);

  const aktif = localeNames[locale];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={acik}
        aria-label="Dil değiştir"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-koyu/10 bg-white px-3 py-1.5 font-heading text-sm font-bold text-koyu shadow-sm transition hover:border-turuncu hover:text-turuncu"
      >
        {aktif.bayrak && <span aria-hidden>{aktif.bayrak}</span>}
        <span className="hidden sm:inline">{aktif.isim}</span>
        <span className="uppercase sm:hidden">{locale}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {acik && (
        <ul
          role="listbox"
          aria-label="Dil seçenekleri"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border-2 border-koyu/10 bg-white shadow-xl"
        >
          {LOCALES.map((kod) => {
            const isim = localeNames[kod].isim;
            const bayrak = localeNames[kod].bayrak;
            const seciliMi = kod === locale;
            return (
              <li key={kod}>
                <Link
                  href={ayniSayfaUrl(kod, pathname)}
                  role="option"
                  aria-selected={seciliMi}
                  onClick={() => setAcik(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-heading text-sm font-bold transition ${
                    seciliMi
                      ? "bg-turuncu text-krem"
                      : "text-koyu hover:bg-sari/40"
                  }`}
                >
                  {bayrak && <span aria-hidden>{bayrak}</span>}
                  <span>{isim}</span>
                  {seciliMi && (
                    <span className="ml-auto" aria-hidden>
                      ✓
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
