import Link from "next/link";
import type { Metadata } from "next";
import type { Kategori } from "@/lib/kurmanji";
import zazacaData from "@/data/zazaca.json";
import { IlerlemeBar } from "@/components/IlerlemeBar";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, localeAd, localeAltAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Zazaca — KurdiFêr",
  description: "Çocuklar için Zazaca kelime kategorileri.",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const kartRenkleri = [
  "bg-turuncu",
  "bg-sari",
  "bg-koyu",
  "bg-turuncu/80",
  "bg-sari/90",
  "bg-koyu/90",
  "bg-turuncu/70",
  "bg-sari/80",
];

export default async function ZazacaPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const kategoriler = (zazacaData.kategoriler as Kategori[]) ?? [];
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

          <ul className="hidden items-center gap-2 sm:flex">
            <NavLink href={`/${locale}/kurmanji`}>
              {dict.navbar.kurmanci}
            </NavLink>
            <NavLink href={`/${locale}/zazaca`}>{dict.navbar.zazaca}</NavLink>
            <NavLink href={`/${locale}/oyunlar`}>{dict.navbar.oyunlar}</NavLink>
            <NavLink href={`/${locale}/ebeveynler`}>
              {dict.navbar.ebeveynler}
            </NavLink>
          </ul>

          <div className="flex items-center gap-2">
            <DilSecici locale={locale} />
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-heading text-sm font-bold text-koyu shadow-sm transition hover:bg-koyu hover:text-krem"
            >
              <span aria-hidden>←</span> {dict.navbar.anasayfa}
            </Link>
          </div>
        </nav>

        <ul className="flex flex-wrap items-center justify-center gap-1 border-t border-koyu/10 px-4 py-2 sm:hidden">
          <NavLink href={`/${locale}/kurmanji`}>{dict.navbar.kurmanci}</NavLink>
          <NavLink href={`/${locale}/zazaca`}>{dict.navbar.zazaca}</NavLink>
          <NavLink href={`/${locale}/oyunlar`}>{dict.navbar.oyunlar}</NavLink>
          <NavLink href={`/${locale}/ebeveynler`}>
            {dict.navbar.ebeveynler}
          </NavLink>
        </ul>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>📚</span> Zazaca Kategorileri
          </span>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight sm:text-5xl">
            Zazaca <span className="text-turuncu">kelimeler</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-koyu/70 sm:text-lg">
            Zazaca lehçesinde 127 kelime, telaffuz rehberi ve örnek cümlelerle.
          </p>
        </div>

        <div className="mx-auto mt-8 inline-flex w-full max-w-xs items-center gap-1 rounded-full border-2 border-koyu/10 bg-white p-1 sm:max-w-sm">
          <Link
            href={`/${locale}/kurmanji`}
            className="flex-1 rounded-full px-4 py-2 text-center font-heading text-sm font-bold text-koyu/70 transition hover:text-koyu sm:text-base"
          >
            {dict.lehce_secici.kurmanci}
          </Link>
          <span
            aria-current="page"
            className="flex-1 rounded-full bg-turuncu px-4 py-2 text-center font-heading text-sm font-bold text-krem shadow-sm sm:text-base"
          >
            {dict.lehce_secici.zazaca}
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {kategoriler.map((kat, i) => (
            <KategoriKart
              key={kat.id}
              locale={locale}
              kategori={kat}
              renkClass={kartRenkleri[i % kartRenkleri.length]}
              kelimeMetin={dict.kategori.kelime}
              ogrenildiText={dict.ilerleme.ogrenildi}
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

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:text-base"
      >
        {children}
      </Link>
    </li>
  );
}

function KategoriKart({
  locale,
  kategori,
  renkClass,
  kelimeMetin,
  ogrenildiText,
}: {
  locale: Locale;
  kategori: Kategori;
  renkClass: string;
  kelimeMetin: string;
  ogrenildiText: string;
}) {
  const koyuKart = renkClass.startsWith("bg-koyu");
  const textColor = koyuKart ? "text-krem" : "text-koyu";
  const altText = koyuKart ? "text-krem/70" : "text-koyu/70";

  return (
    <Link
      href={`/${locale}/zazaca/${kategori.id}`}
      className={`${renkClass} ${textColor} group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-6`}
    >
      <span className="text-4xl transition-transform group-hover:scale-110 sm:text-5xl">
        {kategori.emoji}
      </span>
      <div className="mt-6">
        <p className="font-heading text-xl font-extrabold sm:text-2xl">
          {localeAd(kategori, locale)}
        </p>
        <p className={`mt-0.5 text-sm font-medium ${altText}`}>
          {localeAltAd(kategori, locale)} · {kategori.kelimeler.length}{" "}
          {kelimeMetin}
        </p>
        <IlerlemeBar
          dil="zazaca"
          kategoriId={kategori.id}
          koyuKart={koyuKart}
          ogrenildiText={ogrenildiText}
        />
      </div>
      <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 transition group-hover:scale-150" />
    </Link>
  );
}
