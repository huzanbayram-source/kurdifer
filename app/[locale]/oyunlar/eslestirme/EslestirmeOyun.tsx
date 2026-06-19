"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import kurmanjiData from "@/data/kurmanji.json";
import type { Kategori, Kelime } from "@/lib/kurmanji";
import { getKelimeEmoji } from "@/lib/kelime-emoji";
import { DilSecici } from "@/components/DilSecici";
import type { Locale } from "@/lib/i18n";

const KELIME_SAYISI = 6;
const KAPATMA_GECIKMESI_MS = 600;

type KartTipi = "ku" | "emoji";

interface OyunKarti {
  id: string;
  pairKey: string;
  tip: KartTipi;
  kelime: Kelime;
}

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function olusturKartlar(kategori: Kategori): OyunKarti[] {
  const secilen = karistir(kategori.kelimeler).slice(0, KELIME_SAYISI);
  const kartlar: OyunKarti[] = [];
  for (const kelime of secilen) {
    kartlar.push({
      id: `${kelime.id}-ku`,
      pairKey: kelime.id,
      tip: "ku",
      kelime,
    });
    kartlar.push({
      id: `${kelime.id}-emoji`,
      pairKey: kelime.id,
      tip: "emoji",
      kelime,
    });
  }
  return karistir(kartlar);
}

export function EslestirmeOyun({ locale }: { locale: Locale }) {
  const kategoriler = kurmanjiData.kategoriler as Kategori[];
  const [seciliId, setSeciliId] = useState<string>(kategoriler[0].id);
  const [kartlar, setKartlar] = useState<OyunKarti[]>([]);
  const [acikIds, setAcikIds] = useState<string[]>([]);
  const [eslesenPairKeys, setEslesenPairKeys] = useState<string[]>([]);
  const [hamle, setHamle] = useState(0);
  const [kilit, setKilit] = useState(false);

  const yeniOyun = useCallback(
    (kategoriId: string) => {
      const kat = kategoriler.find((k) => k.id === kategoriId);
      if (!kat) return;
      setKartlar(olusturKartlar(kat));
      setAcikIds([]);
      setEslesenPairKeys([]);
      setHamle(0);
      setKilit(false);
    },
    [kategoriler],
  );

  useEffect(() => {
    yeniOyun(seciliId);
  }, [seciliId, yeniOyun]);

  function kartTik(kart: OyunKarti) {
    if (kilit) return;
    if (eslesenPairKeys.includes(kart.pairKey)) return;
    if (acikIds.includes(kart.id)) return;
    if (acikIds.length >= 2) return;

    const yeniAciks = [...acikIds, kart.id];
    setAcikIds(yeniAciks);

    if (yeniAciks.length === 2) {
      setHamle((h) => h + 1);
      const [aId, bId] = yeniAciks;
      const a = kartlar.find((k) => k.id === aId)!;
      const b = kartlar.find((k) => k.id === bId)!;

      if (a.pairKey === b.pairKey) {
        setEslesenPairKeys((prev) => [...prev, a.pairKey]);
        setAcikIds([]);
      } else {
        setKilit(true);
        setTimeout(() => {
          setAcikIds([]);
          setKilit(false);
        }, KAPATMA_GECIKMESI_MS);
      }
    }
  }

  const tumuEslesti =
    kartlar.length > 0 && eslesenPairKeys.length === KELIME_SAYISI;

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
              href={`/${locale}/oyunlar`}
              className="hidden rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:inline-flex"
            >
              ← Tüm oyunlar
            </Link>
            <DilSecici locale={locale} />
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-heading text-sm font-bold text-koyu shadow-sm transition hover:bg-koyu hover:text-krem"
            >
              <span aria-hidden>←</span> Anasayfa
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>🎮</span> Eşleştirme Oyunu
          </span>
          <h1 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
            Kelimeyi <span className="text-turuncu">eşleştir</span>!
          </h1>
          <p className="mt-2 text-sm text-koyu/70 sm:text-base">
            Aynı kelimenin Kurmancî adını ve emojisini bul.
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-2 px-1 font-heading text-xs font-bold uppercase tracking-wider text-koyu/60">
            Kategori seç
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
            {kategoriler.map((kat) => {
              const aktif = kat.id === seciliId;
              return (
                <button
                  key={kat.id}
                  type="button"
                  onClick={() => setSeciliId(kat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 font-heading text-sm font-bold transition ${
                    aktif
                      ? "bg-turuncu text-krem shadow-md shadow-turuncu/30"
                      : "border-2 border-koyu/10 bg-white text-koyu hover:border-turuncu hover:text-turuncu"
                  }`}
                >
                  <span className="mr-1.5" aria-hidden>
                    {kat.emoji}
                  </span>
                  {kat.tr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-koyu/60 sm:text-xs">
              Hamle
            </p>
            <p className="font-heading text-2xl font-black sm:text-3xl">
              {hamle}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-koyu/60 sm:text-xs">
              Bulunan çift
            </p>
            <p className="font-heading text-2xl font-black text-turuncu sm:text-3xl">
              {eslesenPairKeys.length} / {KELIME_SAYISI}
            </p>
          </div>
          <button
            type="button"
            onClick={() => yeniOyun(seciliId)}
            className="rounded-full bg-koyu px-4 py-2 font-heading text-xs font-bold text-krem transition hover:bg-turuncu sm:text-sm"
          >
            ↻ Yeniden
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4">
          {kartlar.length === 0
            ? Array.from({ length: KELIME_SAYISI * 2 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-koyu/5"
                />
              ))
            : kartlar.map((kart) => {
                const eslesti = eslesenPairKeys.includes(kart.pairKey);
                const acik = acikIds.includes(kart.id);
                return (
                  <Kart
                    key={kart.id}
                    kart={kart}
                    acik={acik}
                    eslesti={eslesti}
                    onTik={() => kartTik(kart)}
                  />
                );
              })}
        </div>
      </section>

      {tumuEslesti && (
        <KazanmaPopup
          hamle={hamle}
          onTekrar={() => yeniOyun(seciliId)}
        />
      )}
    </main>
  );
}

function Kart({
  kart,
  acik,
  eslesti,
  onTik,
}: {
  kart: OyunKarti;
  acik: boolean;
  eslesti: boolean;
  onTik: () => void;
}) {
  const yuzGorunsun = acik || eslesti;

  return (
    <button
      type="button"
      onClick={onTik}
      disabled={eslesti}
      aria-label={
        eslesti
          ? `${kart.kelime.tr} — eşleşti`
          : yuzGorunsun
          ? kart.tip === "ku"
            ? kart.kelime.ku
            : kart.kelime.tr
          : "Kapalı kart"
      }
      className="group aspect-square w-full [perspective:1000px] focus:outline-none focus-visible:ring-4 focus-visible:ring-turuncu/50 rounded-2xl"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          yuzGorunsun ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-koyu text-3xl shadow-md transition group-hover:bg-koyu/90 group-hover:shadow-lg sm:text-4xl [backface-visibility:hidden]">
          <span className="text-krem/90" aria-hidden>
            ?
          </span>
        </div>

        <div
          className={`absolute inset-0 grid place-items-center rounded-2xl p-2 shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden] ${
            eslesti
              ? "border-2 border-emerald-500 bg-emerald-50"
              : "border-2 border-turuncu bg-white"
          }`}
        >
          {kart.tip === "ku" ? (
            <p className="text-center font-heading text-base font-extrabold leading-tight text-koyu sm:text-xl md:text-2xl">
              {kart.kelime.ku}
            </p>
          ) : (
            <span className="text-4xl sm:text-5xl md:text-6xl" aria-hidden>
              {getKelimeEmoji(kart.kelime.id, "✨")}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function KazanmaPopup({
  hamle,
  onTekrar,
}: {
  hamle: number;
  onTekrar: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kazanma-baslik"
      className="fixed inset-0 z-50 grid place-items-center bg-koyu/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-3xl bg-krem p-8 text-center shadow-2xl">
        <p className="text-7xl" aria-hidden>
          🎉
        </p>
        <h2
          id="kazanma-baslik"
          className="mt-4 font-heading text-3xl font-black"
        >
          Tebrîk!
        </h2>
        <p className="mt-2 text-koyu/70">
          Tüm çiftleri{" "}
          <span className="font-bold text-turuncu">{hamle}</span> hamlede
          buldun.
        </p>
        <button
          type="button"
          onClick={onTekrar}
          className="mt-6 w-full rounded-full bg-turuncu px-6 py-3 font-heading font-bold text-krem shadow-lg shadow-turuncu/30 transition hover:-translate-y-0.5 hover:bg-koyu"
        >
          Tekrar Oyna
        </button>
      </div>
    </div>
  );
}
