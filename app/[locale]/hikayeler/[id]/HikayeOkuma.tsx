"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Hikaye } from "@/lib/hikayeler";
import type { Locale } from "@/lib/i18n";
import { DilSecici } from "@/components/DilSecici";

interface OkumaLabels {
  geri_link: string;
  onceki: string;
  sonraki: string;
  sayfa_x_y: string;
  ses_calma_placeholder: string;
  ses_calma_aria: string;
  bitti_emoji: string;
  bitti_baslik: string;
  bitti_buton: string;
  bitti_yeniden: string;
}

interface Props {
  locale: Locale;
  hikaye: Hikaye;
  baslik: string;
  navbar: { anasayfa: string; hikayeler: string };
  okuma: OkumaLabels;
  slogan: string;
}

export function HikayeOkuma({
  locale,
  hikaye,
  baslik,
  navbar,
  okuma,
  slogan,
}: Props) {
  const [konum, setKonum] = useState(0);
  const [sesMesaj, setSesMesaj] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sesDestekleniyor, setSesDestekleniyor] = useState(false);

  const toplam = hikaye.sayfalar.length;
  const sonSayfa = konum >= toplam;
  const aktif = sonSayfa ? null : hikaye.sayfalar[konum];

  useEffect(() => {
    if (sesMesaj) {
      const t = setTimeout(() => setSesMesaj(null), 2400);
      return () => clearTimeout(t);
    }
  }, [sesMesaj]);

  useEffect(() => {
    if (!hikaye.ses) return;
    const audio = new Audio();
    audio.src = hikaye.ses;
    audio.preload = "metadata";
    const onCanPlay = () => setSesDestekleniyor(true);
    const onError = () => setSesDestekleniyor(false);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audioRef.current = audio;
    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [hikaye.ses]);

  function sesCal() {
    const audio = audioRef.current;
    if (audio && sesDestekleniyor) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        setSesMesaj(okuma.ses_calma_placeholder);
      });
      return;
    }
    setSesMesaj(okuma.ses_calma_placeholder);
  }

  function onceki() {
    if (konum > 0) setKonum((k) => k - 1);
    else if (sonSayfa) setKonum(toplam - 1);
  }
  function sonraki() {
    if (konum < toplam) setKonum((k) => k + 1);
  }

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <header className="sticky top-0 z-30 border-b border-koyu/10 bg-krem/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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
              href={`/${locale}/hikayeler`}
              className="hidden rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:inline-flex"
            >
              ← {okuma.geri_link}
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

      <section className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-3xl" aria-hidden>
              {hikaye.emoji}
            </span>
            <h1 className="mt-1 truncate font-heading text-2xl font-black sm:text-3xl">
              {baslik}
            </h1>
          </div>
          <button
            type="button"
            onClick={sesCal}
            aria-label={okuma.ses_calma_aria}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-turuncu px-4 py-2 font-heading text-sm font-bold text-krem shadow-md transition hover:-translate-y-0.5 hover:bg-koyu sm:text-base"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            {okuma.ses_calma_aria}
          </button>
        </div>

        {sesMesaj && (
          <div
            role="status"
            className="mt-3 rounded-2xl border-2 border-sari/50 bg-sari/20 px-4 py-2 text-sm font-semibold text-koyu"
          >
            {sesMesaj}
          </div>
        )}

        <ProgressNoktalar toplam={toplam} aktif={Math.min(konum, toplam - 1)} />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        {aktif ? (
          <Sayfa
            sayfa={aktif}
            sayfaNo={`${konum + 1} / ${toplam}`}
          />
        ) : (
          <SonSayfa
            locale={locale}
            okuma={okuma}
            onYeniden={() => setKonum(0)}
          />
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onceki}
            disabled={konum === 0}
            className="inline-flex items-center gap-2 rounded-full border-2 border-koyu/10 bg-white px-5 py-2.5 font-heading font-bold text-koyu shadow-sm transition hover:border-turuncu hover:text-turuncu disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-koyu/10 disabled:hover:text-koyu"
          >
            <span aria-hidden>←</span> {okuma.onceki}
          </button>
          <p className="hidden font-heading text-sm font-bold text-koyu/60 sm:block">
            {okuma.sayfa_x_y
              .replace("{x}", String(Math.min(konum + 1, toplam)))
              .replace("{y}", String(toplam))}
          </p>
          {sonSayfa ? (
            <Link
              href={`/${locale}/hikayeler`}
              className="inline-flex items-center gap-2 rounded-full bg-turuncu px-5 py-2.5 font-heading font-bold text-krem shadow-md transition hover:-translate-y-0.5 hover:bg-koyu"
            >
              {okuma.bitti_buton} <span aria-hidden>→</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={sonraki}
              className="inline-flex items-center gap-2 rounded-full bg-turuncu px-5 py-2.5 font-heading font-bold text-krem shadow-md transition hover:-translate-y-0.5 hover:bg-koyu"
            >
              {okuma.sonraki} <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </section>

      <footer className="border-t border-koyu/10 bg-krem">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-koyu/60 sm:flex-row sm:px-6 lg:px-8">
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

function ProgressNoktalar({
  toplam,
  aktif,
}: {
  toplam: number;
  aktif: number;
}) {
  return (
    <div
      className="mt-6 flex items-center justify-center gap-2"
      aria-hidden
    >
      {Array.from({ length: toplam }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 rounded-full transition-all ${
            i === aktif
              ? "w-8 bg-turuncu"
              : i < aktif
                ? "w-2.5 bg-turuncu/60"
                : "w-2.5 bg-koyu/15"
          }`}
        />
      ))}
    </div>
  );
}

function Sayfa({
  sayfa,
  sayfaNo,
}: {
  sayfa: { ku: string; tr: string; emoji: string };
  sayfaNo: string;
}) {
  return (
    <article
      key={sayfa.ku}
      className="animate-pop rounded-3xl border-2 border-koyu/10 bg-white p-6 text-center shadow-lg sm:p-10"
    >
      <p className="font-heading text-xs font-bold uppercase tracking-wider text-turuncu">
        {sayfaNo}
      </p>
      <div className="mt-4 text-7xl leading-none sm:text-8xl" aria-hidden>
        {sayfa.emoji}
      </div>
      <p className="mt-8 font-heading text-2xl font-black leading-snug text-koyu sm:text-3xl">
        {sayfa.ku}
      </p>
      <p className="mt-4 text-base text-koyu/70 sm:text-lg">{sayfa.tr}</p>
    </article>
  );
}

function SonSayfa({
  locale,
  okuma,
  onYeniden,
}: {
  locale: Locale;
  okuma: OkumaLabels;
  onYeniden: () => void;
}) {
  return (
    <div className="animate-pop rounded-3xl border-2 border-koyu/10 bg-white p-8 text-center shadow-lg sm:p-12">
      <p className="text-7xl" aria-hidden>
        {okuma.bitti_emoji}
      </p>
      <h2 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
        {okuma.bitti_baslik}
      </h2>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onYeniden}
          className="w-full rounded-full border-2 border-koyu/10 bg-white px-6 py-3 font-heading font-bold text-koyu transition hover:border-turuncu hover:text-turuncu sm:w-auto"
        >
          ↻ {okuma.bitti_yeniden}
        </button>
        <Link
          href={`/${locale}/hikayeler`}
          className="w-full rounded-full bg-turuncu px-6 py-3 font-heading font-bold text-krem shadow-md transition hover:-translate-y-0.5 hover:bg-koyu sm:w-auto"
        >
          {okuma.bitti_buton}
        </Link>
      </div>
    </div>
  );
}
