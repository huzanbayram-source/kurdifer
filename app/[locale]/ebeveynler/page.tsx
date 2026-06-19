import Link from "next/link";
import type { Metadata } from "next";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/lib/dictionary";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const YAYIN_TARIHI = "2026-06-19";
const SITE_URL = "https://kurdifer.app";
const SAYFA_URL = `${SITE_URL}/ebeveynler`;

type ListeOge = { kalin?: string; metin: string };
type Paragraf = string | { tip: "liste"; ogeler: ListeOge[] };

interface Bolum {
  id: string;
  numara: number;
  baslik: string;
  paragraflar: Paragraf[];
}

type EbeveynlerDict = Dictionary["ebeveynler"];

function kelimeSay(bolumler: Bolum[]): number {
  let n = 0;
  for (const b of bolumler) {
    n += b.baslik.split(/\s+/).length;
    for (const p of b.paragraflar) {
      if (typeof p === "string") {
        n += p.split(/\s+/).length;
      } else {
        for (const o of p.ogeler) {
          if (o.kalin) n += o.kalin.split(/\s+/).length;
          n += o.metin.split(/\s+/).length;
        }
      }
    }
  }
  return n;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  const e = dict.ebeveynler;
  const ogLocale =
    params.locale === "en"
      ? "en_US"
      : params.locale === "ku"
      ? "ku_TR"
      : "tr_TR";
  return {
    title: `${e.meta_baslik} | KurdiFêr`,
    description: e.meta_aciklama,
    keywords: e.meta_anahtarlar,
    authors: [{ name: "KurdiFêr" }],
    alternates: { canonical: SAYFA_URL },
    openGraph: {
      title: e.meta_baslik,
      description: e.meta_aciklama,
      type: "article",
      locale: ogLocale,
      url: SAYFA_URL,
      siteName: "KurdiFêr",
      publishedTime: YAYIN_TARIHI,
      modifiedTime: YAYIN_TARIHI,
      authors: ["KurdiFêr"],
      images: [
        {
          url: `${SITE_URL}/og-ebeveynler.png`,
          width: 1200,
          height: 630,
          alt: e.meta_baslik,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: e.meta_baslik,
      description: e.meta_aciklama,
      images: [`${SITE_URL}/og-ebeveynler.png`],
    },
  };
}

export default async function EbeveynlerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;
  const dict = await getDictionary(locale);
  const e = dict.ebeveynler;
  const bolumler = e.bolumler as Bolum[];
  const toplamKelime = kelimeSay(bolumler);
  const okumaDakika = Math.max(1, Math.ceil(toplamKelime / 200));
  const tarihLocale = e.tarih_locale ?? "tr-TR";
  const tarih = new Date(YAYIN_TARIHI).toLocaleDateString(tarihLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const inLanguage =
    locale === "en" ? "en-US" : locale === "ku" ? "ku-TR" : "tr-TR";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: e.meta_baslik,
    description: e.meta_aciklama,
    author: { "@type": "Organization", name: "KurdiFêr", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "KurdiFêr",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    datePublished: YAYIN_TARIHI,
    dateModified: YAYIN_TARIHI,
    image: [`${SITE_URL}/og-ebeveynler.png`],
    inLanguage,
    wordCount: toplamKelime,
    timeRequired: `PT${okumaDakika}M`,
    mainEntityOfPage: { "@type": "WebPage", "@id": SAYFA_URL },
  };

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar locale={locale} dict={dict} />

      <article>
        <Hero
          locale={locale}
          e={e}
          tarih={tarih}
          okumaDakika={okumaDakika}
        />
        <Icindekiler bolumler={bolumler} baslik={e.icindekiler_baslik} />
        <MakaleGovde bolumler={bolumler} />
        <SonCTA locale={locale} e={e} />
      </article>

      <Footer slogan={dict.footer.slogan} />
    </main>
  );
}

function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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
    </header>
  );
}

function Hero({
  locale,
  e,
  tarih,
  okumaDakika,
}: {
  locale: Locale;
  e: EbeveynlerDict;
  tarih: string;
  okumaDakika: number;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-koyu/60 transition hover:text-turuncu"
      >
        <span aria-hidden>‹</span> {e.geri_link}
      </Link>

      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
        <span aria-hidden>👨‍👩‍👧</span> {e.rozet}
      </span>

      <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-balance sm:text-5xl lg:text-6xl">
        {e.hero_baslik_1}{" "}
        <span className="text-turuncu">{e.hero_baslik_vurgu}</span>{" "}
        {e.hero_baslik_2}
      </h1>

      <p className="mt-3 text-base text-koyu/70 sm:text-lg">{e.hero_altyazi}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-koyu/60">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>🕐</span>
          <span>
            {okumaDakika} {e.okuma_etiketi}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>📅</span>
          <time dateTime={YAYIN_TARIHI}>{tarih}</time>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>✍️</span>
          <span>{e.yazar}</span>
        </span>
      </div>
    </section>
  );
}

function Icindekiler({
  bolumler,
  baslik,
}: {
  bolumler: Bolum[];
  baslik: string;
}) {
  return (
    <nav
      aria-label={baslik}
      className="mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl border-2 border-koyu/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="font-heading text-xs font-bold uppercase tracking-wider text-turuncu">
          {baslik}
        </p>
        <ol className="mt-3 space-y-2">
          {bolumler.map((b) => (
            <li key={b.id}>
              <a
                href={`#${b.id}`}
                className="group flex items-baseline gap-3 text-koyu/80 transition hover:text-turuncu"
              >
                <span className="font-heading text-sm font-black text-turuncu/60 group-hover:text-turuncu sm:text-base">
                  {String(b.numara).padStart(2, "0")}
                </span>
                <span className="font-heading text-base font-bold leading-snug sm:text-lg">
                  {b.baslik}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function MakaleGovde({ bolumler }: { bolumler: Bolum[] }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl px-4 sm:mt-16 sm:px-6 lg:px-8">
      {bolumler.map((b) => (
        <Bolum key={b.id} bolum={b} />
      ))}
    </div>
  );
}

function Bolum({ bolum }: { bolum: Bolum }) {
  return (
    <section id={bolum.id} className="scroll-mt-24 pt-2">
      <h2 className="mt-12 flex items-baseline gap-3 font-heading text-3xl font-black leading-tight text-koyu first:mt-0 sm:text-4xl">
        <span className="text-turuncu/70">
          {String(bolum.numara).padStart(2, "0")}.
        </span>
        <span>{bolum.baslik}</span>
      </h2>

      <div className="mt-5 space-y-5 text-base leading-relaxed text-koyu/85 sm:text-lg sm:leading-relaxed">
        {bolum.paragraflar.map((p, i) =>
          typeof p === "string" ? (
            <p key={i}>{p}</p>
          ) : (
            <ul key={i} className="space-y-3">
              {p.ogeler.map((o, j) => (
                <li
                  key={j}
                  className="rounded-2xl border-l-4 border-turuncu/70 bg-white/60 p-4 shadow-sm sm:p-5"
                >
                  {o.kalin && (
                    <span className="font-heading font-extrabold text-koyu">
                      {o.kalin}
                      {" — "}
                    </span>
                  )}
                  <span>{o.metin}</span>
                </li>
              ))}
            </ul>
          ),
        )}
      </div>
    </section>
  );
}

function SonCTA({ locale, e }: { locale: Locale; e: EbeveynlerDict }) {
  return (
    <section className="mx-auto mt-16 max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="rounded-3xl bg-koyu p-8 text-center text-krem shadow-xl sm:p-10">
        <p className="text-5xl" aria-hidden>
          🌱
        </p>
        <h2 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
          {e.son_cta_baslik}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-krem/75 sm:text-lg">
          {e.son_cta_altyazi}
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/kurmanji`}
            className="w-full rounded-full bg-turuncu px-7 py-3 font-heading font-bold text-krem shadow-lg shadow-turuncu/30 transition hover:-translate-y-0.5 hover:bg-sari hover:text-koyu sm:w-auto"
          >
            {e.son_cta_buton_kurmanci}
          </Link>
          <Link
            href={`/${locale}/zazaca`}
            className="w-full rounded-full border-2 border-krem/30 bg-koyu px-7 py-3 font-heading font-bold text-krem transition hover:border-turuncu hover:text-turuncu sm:w-auto"
          >
            {e.son_cta_buton_zazaca}
          </Link>
        </div>
      </div>
    </section>
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
