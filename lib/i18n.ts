export const LOCALES = ["tr", "en", "ku"] as const;
export const DEFAULT_LOCALE: Locale = "tr";

export type Locale = (typeof LOCALES)[number];

export function isValidLocale(l: string): l is Locale {
  return (LOCALES as readonly string[]).includes(l);
}

export interface LocaleInfo {
  isim: string;
  bayrak: string;
}

export const localeNames: Record<Locale, LocaleInfo> = {
  tr: { isim: "Türkçe", bayrak: "🇹🇷" },
  en: { isim: "English", bayrak: "🇬🇧" },
  ku: { isim: "Kurdî", bayrak: "" },
};

interface CokDilliAd {
  tr: string;
  en: string;
  ku: string;
}

export function localeAd(item: CokDilliAd, locale: Locale): string {
  if (locale === "en") return item.en;
  if (locale === "ku") return item.ku;
  return item.tr;
}

export function localeAltAd(item: CokDilliAd, locale: Locale): string {
  if (locale === "ku") return item.tr;
  return item.ku;
}
