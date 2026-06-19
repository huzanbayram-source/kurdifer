import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import {
  getTumKategoriler,
  getTumVideolar,
} from "@/lib/videolar";
import { VideolarListe } from "./VideolarListe";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: `${dict.videolar_sayfa.rozet} — KurdiFêr`,
    description: dict.videolar_sayfa.altyazi,
  };
}

export default async function VideolarPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  return (
    <VideolarListe
      locale={params.locale}
      kategoriler={getTumKategoriler()}
      videolar={getTumVideolar()}
      navbar={{
        anasayfa: dict.navbar.anasayfa,
        ebeveynler: dict.navbar.ebeveynler,
      }}
      sayfa={dict.videolar_sayfa}
      slogan={dict.footer.slogan}
    />
  );
}
