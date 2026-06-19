import type { Locale } from "@/lib/i18n";

const loaders = {
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  ku: () => import("@/dictionaries/ku.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof loaders)["tr"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders.tr;
  return load();
}
