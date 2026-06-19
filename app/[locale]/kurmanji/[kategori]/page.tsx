import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getKategori } from "@/lib/kurmanji";
import { getKelimeEmoji } from "@/lib/kelime-emoji";
import kurmanjiData from "@/data/kurmanji.json";
import { KelimeKart } from "@/components/KelimeKart";
import { IlerlemePanel } from "@/components/IlerlemePanel";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, localeAd, localeAltAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

const seviyeRozet: Record<string, string> = {
  kolay: "bg-sari/40 text-koyu",
  orta: "bg-turuncu/20 text-turuncu",
  zor: "bg-koyu text-krem",
};

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    kurmanjiData.kategoriler.map((k) => ({ locale, kategori: k.id })),
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; kategori: string };
}): Metadata {
  const kategori = getKategori(params.kategori);
  if (!kategori) return { title: "Kategori bulunamadı — KurdiFêr" };
  return {
    title: `${kategori.tr} (${kategori.ku}) — KurdiFêr`,
    description: `${kategori.tr} kategorisinde ${kategori.kelimeler.length} Kürtçe kelime, telaffuzu ve örnek cümleleriyle.`,
  };
}

export default async function KategoriPage({
  params,
}: {
  params: { locale: Locale; kategori: string };
}) {
  const kategori = getKategori(params.kategori);
  if (!kategori) notFound();
  const dict = await getDictionary(params.locale);
  const locale = params.locale;

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <header className="sticky top-0 z-30 border-b border-koyu/10 bg-krem/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-turuncu text-xl">
              🌟
            </span>
            <span className="font-heading text-2xl font-extrabold tracking-tight">
              Kurdi<span className="text-turuncu">Fêr</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/zazaca`}
              className="hidden rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:inline-flex"
            >
              {dict.navbar.zazaca}
            </Link>
            <Link
              href={`/${locale}/ebeveynler`}
              className="hidden rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:inline-flex"
            >
              {dict.navbar.ebeveynler}
            </Link>
            <DilSecici locale={locale} />
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-heading text-sm font-bold text-koyu shadow-sm transition hover:bg-koyu hover:text-krem"
            >
              <span aria-hidden>←</span> {dict.navbar.anasayfa}
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-koyu/60 transition hover:text-turuncu"
        >
          <span aria-hidden>‹</span> {dict.navbar.tum_kategoriler}
        </Link>

        <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-turuncu text-5xl shadow-lg shadow-turuncu/30 sm:h-24 sm:w-24 sm:text-6xl">
            {kategori.emoji}
          </span>
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider ${
                seviyeRozet[kategori.seviye] ?? seviyeRozet.kolay
              }`}
            >
              {dict.seviye[kategori.seviye as "kolay" | "orta" | "zor"] ??
                kategori.seviye}
            </span>
            <h1 className="mt-2 font-heading text-4xl font-black leading-tight sm:text-5xl">
              {localeAd(kategori, locale)}{" "}
              <span className="text-turuncu">
                ({localeAltAd(kategori, locale)})
              </span>
            </h1>
            <p className="mt-2 text-base text-koyu/70 sm:text-lg">
              {kategori.kelimeler.length} {dict.kategori.kelime} ·{" "}
              {dict.kategori.ipucu_dokun}
            </p>
          </div>
        </div>

        <IlerlemePanel
          dil="kurmanji"
          kategoriId={kategori.id}
          baslikText={dict.ilerleme.baslik}
          tamamlandiText={dict.ilerleme.tamamlandi}
          tamamlandiMesaj={dict.ilerleme.tamamlandi_mesaji}
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {kategori.kelimeler.map((kelime) => (
            <KelimeKart
              key={kelime.id}
              kelime={kelime}
              emoji={getKelimeEmoji(kelime.id, kategori.emoji)}
              dil="kurmanji"
              ceviri={
                locale === "en" ? kelime.en : kelime.tr
              }
              labels={{
                ornek_cumle: dict.kategori.ornek_cumle,
                ogrendim: dict.ilerleme.ogrendim,
                ogrenildi: dict.ilerleme.ogrenildi_buton,
                isaretle: dict.ilerleme.isaretle,
                kaldir: dict.ilerleme.kaldir,
              }}
            />
          ))}
        </div>
      </section>

      <footer className="border-t border-koyu/10 bg-krem">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-koyu/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-heading font-bold text-koyu">KurdiFêr</span>
          </p>
          <p>{dict.footer.slogan}</p>
        </div>
      </footer>
    </main>
  );
}
