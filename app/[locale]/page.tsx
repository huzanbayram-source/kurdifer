import Link from "next/link";
import { Kategori } from "@/lib/kurmanji";
import kurmanjiData from "@/data/kurmanji.json";
import { SesButonu } from "@/components/SesButonu";
import { IlerlemeBar } from "@/components/IlerlemeBar";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, localeAd, localeAltAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const heroKelimeler = [
  { ku: "Pisîk", tr: "Kedi", emoji: "🐱" },
  { ku: "Gur", tr: "Kurt", emoji: "🐺" },
  { ku: "Masî", tr: "Balık", emoji: "🐟" },
  { ku: "Hesp", tr: "At", emoji: "🐴" },
  { ku: "Rovî", tr: "Tilki", emoji: "🦊" },
];

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

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const kategoriler = (kurmanjiData.kategoriler as Kategori[]) ?? [];
  const locale = params.locale;

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <Navbar locale={locale} dict={dict.navbar} />
      <Hero locale={locale} dict={dict.home} />
      <KategoriGrid
        locale={locale}
        kategoriler={kategoriler}
        dictHome={dict.home}
        dictLehce={dict.lehce_secici}
        kelimeMetin={dict.kategori.kelime}
        ogrenildiText={dict.ilerleme.ogrenildi}
      />
      <Footer slogan={dict.footer.slogan} />
    </main>
  );
}

function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: { [k: string]: string };
}) {
  return (
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
          <NavLink href={`/${locale}/kurmanji`}>{dict.kurmanci}</NavLink>
          <NavLink href={`/${locale}/zazaca`}>{dict.zazaca}</NavLink>
          <NavLink href={`/${locale}/oyunlar`}>{dict.oyunlar}</NavLink>
          <NavLink href={`/${locale}/ebeveynler`}>{dict.ebeveynler}</NavLink>
        </ul>

        <div className="flex items-center gap-2">
          <DilSecici locale={locale} />
          <Link
            href={`/${locale}/kurmanji`}
            className="rounded-full bg-koyu px-4 py-2 font-heading text-sm font-bold text-krem transition hover:bg-turuncu sm:px-5"
          >
            {dict.basla}
          </Link>
        </div>
      </nav>

      <ul className="flex flex-wrap items-center justify-center gap-1 border-t border-koyu/10 px-4 py-2 sm:hidden">
        <NavLink href={`/${locale}/kurmanji`}>{dict.kurmanci}</NavLink>
        <NavLink href={`/${locale}/zazaca`}>{dict.zazaca}</NavLink>
        <NavLink href={`/${locale}/oyunlar`}>{dict.oyunlar}</NavLink>
        <NavLink href={`/${locale}/ebeveynler`}>{dict.ebeveynler}</NavLink>
      </ul>
    </header>
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

function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: { [k: string]: string };
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
              <span>🎉</span> {dict.rozet}
            </span>
            <h1 className="mt-5 font-heading text-4xl font-black leading-tight text-balance sm:text-5xl lg:text-6xl">
              {dict.baslik_oncesi}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-turuncu">
                  {dict.baslik_vurgu}
                </span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-sari/70" />
              </span>{" "}
              {dict.baslik_sonrasi}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-koyu/70 sm:text-lg lg:mx-0">
              {dict.altyazi}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={`/${locale}/kurmanji`}
                className="w-full rounded-full bg-turuncu px-7 py-3 font-heading font-bold text-krem shadow-lg shadow-turuncu/30 transition hover:-translate-y-0.5 hover:bg-koyu sm:w-auto"
              >
                {dict.cta_basla}
              </Link>
              <Link
                href={`/${locale}/oyunlar`}
                className="w-full rounded-full border-2 border-koyu/10 bg-white px-7 py-3 font-heading font-bold text-koyu transition hover:border-turuncu hover:text-turuncu sm:w-auto"
              >
                {dict.cta_oyunlar}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
            {heroKelimeler.map((k, i) => (
              <HeroKelimeKart key={k.ku} kelime={k} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroKelimeKart({
  kelime,
  index,
}: {
  kelime: { ku: string; tr: string; emoji: string };
  index: number;
}) {
  const renkler = [
    "bg-turuncu text-krem",
    "bg-sari text-koyu",
    "bg-koyu text-krem",
    "bg-white text-koyu border-2 border-koyu/10",
    "bg-turuncu/90 text-krem",
  ];
  const renk = renkler[index % renkler.length];
  const buyuk = index === 4;

  return (
    <div
      className={`${renk} ${
        buyuk ? "col-span-2 sm:col-span-1" : ""
      } group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
    >
      <SesButonu
        text={kelime.ku}
        ariaLabel={`${kelime.ku} kelimesini dinle`}
        className="absolute right-2 top-2 z-10 h-9 w-9 !bg-white !text-koyu sm:right-3 sm:top-3 sm:h-10 sm:w-10"
      />
      <span className="text-5xl transition-transform group-hover:scale-110 sm:text-6xl">
        {kelime.emoji}
      </span>
      <div className="text-center">
        <p className="font-heading text-xl font-extrabold leading-none sm:text-2xl">
          {kelime.ku}
        </p>
        <p className="mt-1 text-xs font-medium opacity-80 sm:text-sm">
          {kelime.tr}
        </p>
      </div>
    </div>
  );
}

function KategoriGrid({
  locale,
  kategoriler,
  dictHome,
  dictLehce,
  kelimeMetin,
  ogrenildiText,
}: {
  locale: Locale;
  kategoriler: Kategori[];
  dictHome: { [k: string]: string };
  dictLehce: { [k: string]: string };
  kelimeMetin: string;
  ogrenildiText: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
        <h2 className="font-heading text-3xl font-black sm:text-4xl">
          {dictHome.kategoriler_baslik}
        </h2>
        <p className="mt-3 max-w-md text-koyu/70">
          {dictHome.kategoriler_altyazi}
        </p>

        <div
          role="tablist"
          aria-label="Lehçe seç"
          className="mt-6 inline-flex w-full max-w-xs items-center gap-1 rounded-full border-2 border-koyu/10 bg-white p-1 sm:max-w-sm"
        >
          <span
            role="tab"
            aria-selected="true"
            aria-current="page"
            className="flex-1 rounded-full bg-turuncu px-4 py-2 text-center font-heading text-sm font-bold text-krem shadow-sm sm:text-base"
          >
            {dictLehce.kurmanci}
          </span>
          <Link
            role="tab"
            aria-selected="false"
            href={`/${locale}/zazaca`}
            className="flex-1 rounded-full px-4 py-2 text-center font-heading text-sm font-bold text-koyu/70 transition hover:text-koyu sm:text-base"
          >
            {dictLehce.zazaca}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {kategoriler.map((kat, i) => (
          <KategoriKart
            key={kat.id}
            locale={locale}
            kategori={kat}
            renkClass={kartRenkleri[i % kartRenkleri.length]}
            kelimeMetin={kelimeMetin}
            ogrenildiText={ogrenildiText}
          />
        ))}
      </div>
    </section>
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
      href={`/${locale}/kurmanji/${kategori.id}`}
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
          dil="kurmanji"
          kategoriId={kategori.id}
          koyuKart={koyuKart}
          ogrenildiText={ogrenildiText}
        />
      </div>
      <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 transition group-hover:scale-150" />
    </Link>
  );
}

function Footer({ slogan }: { slogan: string }) {
  return (
    <footer className="border-t border-koyu/10 bg-krem">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-koyu/60 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-heading font-bold text-koyu">KurdiFêr</span>
        </p>
        <p>{slogan}</p>
      </div>
    </footer>
  );
}
