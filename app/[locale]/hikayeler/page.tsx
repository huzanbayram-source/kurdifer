import Link from "next/link";
import type { Metadata } from "next";
import { getTumHikayeler, type Hikaye } from "@/lib/hikayeler";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, localeAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

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
    title: `${dict.hikayeler_sayfa.rozet} — KurdiFêr`,
    description: dict.hikayeler_sayfa.altyazi,
  };
}

const seviyeRozet: Record<string, string> = {
  kolay: "bg-sari/40 text-koyu",
  orta: "bg-turuncu/20 text-turuncu",
  zor: "bg-koyu text-krem",
};

const kartRenkleri = [
  "bg-turuncu",
  "bg-sari",
  "bg-koyu",
  "bg-turuncu/80",
  "bg-sari/90",
  "bg-koyu/90",
];

export default async function HikayelerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const locale = params.locale;
  const hikayeler = getTumHikayeler();

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

      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>📖</span> {dict.hikayeler_sayfa.rozet}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight sm:text-5xl">
            {dict.hikayeler_sayfa.baslik_oncesi}
            {dict.hikayeler_sayfa.baslik_oncesi && " "}
            <span className="text-turuncu">
              {dict.hikayeler_sayfa.baslik_vurgu}
            </span>
            {dict.hikayeler_sayfa.baslik_sonrasi && " "}
            {dict.hikayeler_sayfa.baslik_sonrasi}
          </h1>
          <p className="mt-3 max-w-xl text-base text-koyu/70 sm:text-lg">
            {dict.hikayeler_sayfa.altyazi}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {hikayeler.map((h, i) => (
            <HikayeKart
              key={h.id}
              locale={locale}
              hikaye={h}
              renkClass={kartRenkleri[i % kartRenkleri.length]}
              dakikaText={dict.hikayeler_sayfa.dakika}
              sayfaText={dict.hikayeler_sayfa.sayfa}
              seviyeText={
                dict.seviye[h.seviye as "kolay" | "orta" | "zor"] ?? h.seviye
              }
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

function HikayeKart({
  locale,
  hikaye,
  renkClass,
  dakikaText,
  sayfaText,
  seviyeText,
}: {
  locale: Locale;
  hikaye: Hikaye;
  renkClass: string;
  dakikaText: string;
  sayfaText: string;
  seviyeText: string;
}) {
  const koyuKart = renkClass.startsWith("bg-koyu");
  const textColor = koyuKart ? "text-krem" : "text-koyu";
  const altText = koyuKart ? "text-krem/70" : "text-koyu/70";
  const rozetClass = koyuKart
    ? "bg-krem/15 text-krem"
    : seviyeRozet[hikaye.seviye] ?? seviyeRozet.kolay;

  return (
    <Link
      href={`/${locale}/hikayeler/${hikaye.id}`}
      className={`${renkClass} ${textColor} group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-6xl transition-transform group-hover:scale-110 sm:text-7xl">
          {hikaye.emoji}
        </span>
        <span
          className={`shrink-0 rounded-full px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider ${rozetClass}`}
        >
          {seviyeText}
        </span>
      </div>

      <div className="mt-6">
        <p className="font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
          {localeAd(hikaye.baslik, locale)}
        </p>
        <p className={`mt-2 text-sm font-medium ${altText}`}>
          🕐 {hikaye.sure_dakika} {dakikaText} · 📄 {hikaye.sayfalar.length}{" "}
          {sayfaText}
        </p>
      </div>

      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 transition group-hover:scale-150" />
    </Link>
  );
}
