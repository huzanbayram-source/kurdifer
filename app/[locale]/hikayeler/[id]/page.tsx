import { notFound } from "next/navigation";
import type { Metadata } from "next";
import hikayelerData from "@/data/hikayeler.json";
import { getHikaye } from "@/lib/hikayeler";
import { LOCALES, localeAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { HikayeOkuma } from "./HikayeOkuma";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    hikayelerData.hikayeler.map((h) => ({ locale, id: h.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string };
}): Promise<Metadata> {
  const hikaye = getHikaye(params.id);
  if (!hikaye) return { title: "—" };
  return {
    title: `${localeAd(hikaye.baslik, params.locale)} — KurdiFêr`,
  };
}

export default async function HikayeSayfa({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const hikaye = getHikaye(params.id);
  if (!hikaye) notFound();
  const dict = await getDictionary(params.locale);

  return (
    <HikayeOkuma
      locale={params.locale}
      hikaye={hikaye}
      baslik={localeAd(hikaye.baslik, params.locale)}
      navbar={{
        anasayfa: dict.navbar.anasayfa,
        hikayeler: dict.navbar.hikayeler,
      }}
      okuma={dict.hikaye_okuma}
      slogan={dict.footer.slogan}
    />
  );
}
