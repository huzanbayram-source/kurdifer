import Link from "next/link";
import type { Metadata } from "next";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Oyunlar — KurdiFêr",
  description:
    "Çocukların eğlenerek Kürtçe öğrendiği interaktif oyunlar: eşleştirme ve kelime bulmaca.",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface Oyun {
  id: string;
  href: (locale: Locale) => string;
  emoji: string;
  baslik: string;
  aciklama: string;
  renk: string;
  metin: string;
}

const oyunlar: Oyun[] = [
  {
    id: "eslestirme",
    href: (l) => `/${l}/oyunlar/eslestirme`,
    emoji: "🎴",
    baslik: "Eşleştirme",
    aciklama:
      "Kurmancî kelimeyi emojisiyle eşleştir. Bellek ve eşleştirme oyunu.",
    renk: "bg-turuncu",
    metin: "text-krem",
  },
  {
    id: "kelime-bulmaca",
    href: (l) => `/${l}/oyunlar/kelime-bulmaca`,
    emoji: "🔤",
    baslik: "Kelime Bulmaca",
    aciklama:
      "Eksik harfleri tamamla. Türkçe karşılığı yardımcı, doğru tahmin puan kazandırır.",
    renk: "bg-sari",
    metin: "text-koyu",
  },
];

export default async function OyunlarPage({
  params,
}: {
  params: { locale: Locale };
}) {
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

      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>🎮</span> {dict.navbar.oyunlar}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-black sm:text-5xl">
            Oyna ve <span className="text-turuncu">öğren</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-koyu/70 sm:text-lg">
            Kelimeleri eğlenceli oyunlarla pekiştir. Her oyun farklı bir
            beceriyi geliştirir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {oyunlar.map((o) => (
            <Link
              key={o.id}
              href={o.href(locale)}
              className={`${o.renk} ${o.metin} group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-8`}
            >
              <span className="text-5xl transition-transform group-hover:scale-110 sm:text-6xl">
                {o.emoji}
              </span>
              <div className="mt-8">
                <p className="font-heading text-2xl font-extrabold sm:text-3xl">
                  {o.baslik}
                </p>
                <p className="mt-2 text-sm opacity-80 sm:text-base">
                  {o.aciklama}
                </p>
              </div>
              <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 transition group-hover:scale-150" />
            </Link>
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
