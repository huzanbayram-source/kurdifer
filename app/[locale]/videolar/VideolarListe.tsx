"use client";

import Link from "next/link";
import { useState } from "react";
import { DilSecici } from "@/components/DilSecici";
import { localeAd, type Locale } from "@/lib/i18n";
import type { Video, VideoKategori } from "@/lib/videolar";

interface SayfaLabels {
  rozet: string;
  baslik_oncesi: string;
  baslik_vurgu: string;
  baslik_sonrasi: string;
  altyazi: string;
  tumu: string;
  dakika: string;
  yakinda_rozet: string;
  filtre_etiketi: string;
}

interface Props {
  locale: Locale;
  kategoriler: VideoKategori[];
  videolar: Video[];
  navbar: { anasayfa: string; ebeveynler: string };
  sayfa: SayfaLabels;
  slogan: string;
}

export function VideolarListe({
  locale,
  kategoriler,
  videolar,
  navbar,
  sayfa,
  slogan,
}: Props) {
  const [seciliId, setSeciliId] = useState<string>("tumu");

  const gosterilen =
    seciliId === "tumu"
      ? videolar
      : videolar.filter((v) => v.kategori === seciliId);

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
              {navbar.ebeveynler}
            </Link>
            <DilSecici locale={locale} />
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-heading text-sm font-bold text-koyu shadow-sm transition hover:bg-koyu hover:text-krem"
            >
              <span aria-hidden>←</span> {navbar.anasayfa}
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>📺</span> {sayfa.rozet}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight sm:text-5xl">
            {sayfa.baslik_oncesi}
            {sayfa.baslik_oncesi && " "}
            <span className="text-turuncu">{sayfa.baslik_vurgu}</span>
            {sayfa.baslik_sonrasi && " "}
            {sayfa.baslik_sonrasi}
          </h1>
          <p className="mt-3 max-w-xl text-base text-koyu/70 sm:text-lg">
            {sayfa.altyazi}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={sayfa.filtre_etiketi}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <KategoriPill
            aktif={seciliId === "tumu"}
            onClick={() => setSeciliId("tumu")}
          >
            ✨ {sayfa.tumu}
          </KategoriPill>
          {kategoriler.map((k) => (
            <KategoriPill
              key={k.id}
              aktif={seciliId === k.id}
              onClick={() => setSeciliId(k.id)}
            >
              <span className="mr-1.5" aria-hidden>
                {k.emoji}
              </span>
              {localeAd(k.baslik, locale)}
            </KategoriPill>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {gosterilen.map((v) => (
            <VideoKart
              key={v.id}
              locale={locale}
              video={v}
              dakikaText={sayfa.dakika}
              yakindaRozet={sayfa.yakinda_rozet}
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
          <p>{slogan}</p>
        </div>
      </footer>
    </main>
  );
}

function KategoriPill({
  aktif,
  onClick,
  children,
}: {
  aktif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={aktif}
      onClick={onClick}
      className={`rounded-full px-4 py-2 font-heading text-sm font-bold transition ${
        aktif
          ? "bg-turuncu text-krem shadow-md shadow-turuncu/30"
          : "border-2 border-koyu/10 bg-white text-koyu hover:border-turuncu hover:text-turuncu"
      }`}
    >
      {children}
    </button>
  );
}

function VideoKart({
  locale,
  video,
  dakikaText,
  yakindaRozet,
}: {
  locale: Locale;
  video: Video;
  dakikaText: string;
  yakindaRozet: string;
}) {
  const yakinda = !video.youtube_id;

  return (
    <Link
      href={`/${locale}/videolar/${video.id}`}
      className="group relative overflow-hidden rounded-3xl border-2 border-koyu/10 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full bg-gradient-to-br from-koyu via-koyu to-turuncu/60">
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="text-6xl transition-transform group-hover:scale-110 sm:text-7xl"
            aria-hidden
          >
            {video.emoji}
          </span>
        </div>
        <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-krem/95 shadow-md">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-turuncu"
            aria-hidden
          >
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </div>
        {yakinda && (
          <div className="absolute left-3 top-3 rounded-full bg-koyu px-3 py-1 font-heading text-xs font-bold text-krem shadow-md">
            {yakindaRozet}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-heading text-lg font-extrabold leading-snug text-koyu sm:text-xl">
          {localeAd(video.baslik, locale)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-koyu/70">
          {localeAd(video.aciklama, locale)}
        </p>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-koyu/50">
          🕐 {video.sure_dakika} {dakikaText}
        </p>
      </div>
    </Link>
  );
}
