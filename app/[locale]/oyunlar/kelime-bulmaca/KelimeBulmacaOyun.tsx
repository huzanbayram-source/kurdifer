"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import kurmanjiData from "@/data/kurmanji.json";
import type { Kategori, Kelime } from "@/lib/kurmanji";
import { getKelimeEmojiByTr } from "@/lib/kelime-emoji";
import { DilSecici } from "@/components/DilSecici";
import type { Locale } from "@/lib/i18n";

const KELIME_SAYISI = 10;
const ILK_DENEME_PUAN = 10;
const SONRAKI_DENEME_PUAN = 5;
const YANLIS_TEMIZLEME_MS = 500;
const TAMAMLAMA_GECIKMESI_MS = 1000;

type KutuDurum = "bos" | "dogru" | "yanlis";

interface BulmacaKelimesi {
  kelime: Kelime;
  gizliPozisyonlar: number[];
}

function karistir<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gizliPozisyonSec(word: string): number[] {
  const len = word.length;
  let hedef: number;
  if (len <= 4) hedef = 1;
  else if (len <= 6) hedef = 2;
  else hedef = Math.random() < 0.5 ? 2 : 3;

  const adaylar: number[] = [];
  for (let i = 1; i < len; i++) {
    if (/^[a-zA-Z]$/.test(word[i])) adaylar.push(i);
  }
  if (adaylar.length === 0 && /^[a-zA-Z]$/.test(word[0])) adaylar.push(0);
  if (adaylar.length === 0) return [];

  const sayi = Math.min(hedef, adaylar.length);
  return karistir(adaylar)
    .slice(0, sayi)
    .sort((a, b) => a - b);
}

function bulmacaOlustur(kategori: Kategori): BulmacaKelimesi[] {
  return karistir(kategori.kelimeler)
    .slice(0, KELIME_SAYISI)
    .map((k) => ({
      kelime: k,
      gizliPozisyonlar: gizliPozisyonSec(k.ku),
    }));
}

export function KelimeBulmacaOyun({ locale }: { locale: Locale }) {
  const kategoriler = kurmanjiData.kategoriler as Kategori[];
  const [seciliId, setSeciliId] = useState<string>(kategoriler[0].id);
  const [bulmacalar, setBulmacalar] = useState<BulmacaKelimesi[]>([]);
  const [konum, setKonum] = useState(0);
  const [girilenler, setGirilenler] = useState<string[]>([]);
  const [durumlar, setDurumlar] = useState<KutuDurum[]>([]);
  const [hatali, setHatali] = useState(false);
  const [puan, setPuan] = useState(0);
  const [kelimeTamam, setKelimeTamam] = useState(false);
  const [oyunBitti, setOyunBitti] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const yeniOyun = useCallback(
    (kategoriId: string) => {
      const kat = kategoriler.find((k) => k.id === kategoriId);
      if (!kat) return;
      const yeni = bulmacaOlustur(kat);
      const ilk = yeni[0]?.gizliPozisyonlar.length ?? 0;
      setBulmacalar(yeni);
      setKonum(0);
      setGirilenler(Array(ilk).fill(""));
      setDurumlar(Array(ilk).fill("bos") as KutuDurum[]);
      setHatali(false);
      setPuan(0);
      setKelimeTamam(false);
      setOyunBitti(false);
    },
    [kategoriler],
  );

  useEffect(() => {
    yeniOyun(seciliId);
  }, [seciliId, yeniOyun]);

  useEffect(() => {
    if (bulmacalar.length === 0 || oyunBitti) return;
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 60);
    return () => clearTimeout(t);
  }, [konum, bulmacalar.length, oyunBitti]);

  function kelimeTamamla(yeniHatali: boolean) {
    setKelimeTamam(true);
    setPuan((p) => p + (yeniHatali ? SONRAKI_DENEME_PUAN : ILK_DENEME_PUAN));

    setTimeout(() => {
      if (konum + 1 >= bulmacalar.length) {
        setOyunBitti(true);
        setKelimeTamam(false);
      } else {
        const yeniKonum = konum + 1;
        const sonraki = bulmacalar[yeniKonum];
        const n = sonraki.gizliPozisyonlar.length;
        setKonum(yeniKonum);
        setGirilenler(Array(n).fill(""));
        setDurumlar(Array(n).fill("bos") as KutuDurum[]);
        setHatali(false);
        setKelimeTamam(false);
      }
    }, TAMAMLAMA_GECIKMESI_MS);
  }

  function girisYap(idx: number, ham: string) {
    if (kelimeTamam || oyunBitti) return;
    if (durumlar[idx] === "yanlis" || durumlar[idx] === "dogru") return;
    if (!ham) return;
    const value = ham.slice(-1);

    const aktif = bulmacalar[konum];
    const beklenenChar = aktif.kelime.ku[aktif.gizliPozisyonlar[idx]];
    const dogru = value.toLowerCase() === beklenenChar.toLowerCase();

    if (dogru) {
      const sonrakiGirilenler = [...girilenler];
      sonrakiGirilenler[idx] = value;
      const sonrakiDurumlar = [...durumlar];
      sonrakiDurumlar[idx] = "dogru";
      setGirilenler(sonrakiGirilenler);
      setDurumlar(sonrakiDurumlar);

      const sonrakiBos = sonrakiDurumlar.findIndex(
        (d, i) => d === "bos" && i !== idx,
      );
      if (sonrakiBos !== -1) {
        setTimeout(() => inputRefs.current[sonrakiBos]?.focus(), 50);
      } else {
        kelimeTamamla(hatali);
      }
    } else {
      const sonrakiGirilenler = [...girilenler];
      sonrakiGirilenler[idx] = value;
      const sonrakiDurumlar = [...durumlar];
      sonrakiDurumlar[idx] = "yanlis";
      setGirilenler(sonrakiGirilenler);
      setDurumlar(sonrakiDurumlar);
      setHatali(true);

      setTimeout(() => {
        setGirilenler((prev) => {
          const c = [...prev];
          c[idx] = "";
          return c;
        });
        setDurumlar((prev) => {
          const c = [...prev];
          c[idx] = "bos";
          return c;
        });
        inputRefs.current[idx]?.focus();
      }, YANLIS_TEMIZLEME_MS);
    }
  }

  const aktif = bulmacalar[konum];

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <Navbar locale={locale} />

      <section className="mx-auto max-w-3xl px-4 pb-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
            <span aria-hidden>🔤</span> Kelime Bulmaca
          </span>
          <h1 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
            Eksik harfleri <span className="text-turuncu">tamamla</span>!
          </h1>
          <p className="mt-2 text-sm text-koyu/70 sm:text-base">
            Emoji ve Türkçe karşılığı sana yardımcı olacak.
          </p>
        </div>

        <KategoriSecici
          kategoriler={kategoriler}
          seciliId={seciliId}
          onSec={setSeciliId}
        />

        <SkorPaneli
          konum={Math.min(konum + (oyunBitti ? 1 : 0), bulmacalar.length)}
          toplam={bulmacalar.length || KELIME_SAYISI}
          puan={puan}
          onYeniden={() => yeniOyun(seciliId)}
        />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        {!aktif || oyunBitti ? (
          <div className="grid h-48 place-items-center rounded-3xl border-2 border-dashed border-koyu/15 bg-white/50 text-koyu/40">
            <p className="text-sm">Hazırlanıyor…</p>
          </div>
        ) : (
          <BulmacaKart
            aktif={aktif}
            girilenler={girilenler}
            durumlar={durumlar}
            kelimeTamam={kelimeTamam}
            inputRefs={inputRefs}
            onGiris={girisYap}
          />
        )}
      </section>

      {oyunBitti && (
        <BitirmeModal
          puan={puan}
          toplam={bulmacalar.length}
          onTekrar={() => yeniOyun(seciliId)}
          onKategoriDegistir={() => {
            setOyunBitti(false);
            setTimeout(() => {
              document
                .getElementById("kategori-secici")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
          }}
        />
      )}
    </main>
  );
}

function Navbar({ locale }: { locale: Locale }) {
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
  );
}

function KategoriSecici({
  kategoriler,
  seciliId,
  onSec,
}: {
  kategoriler: Kategori[];
  seciliId: string;
  onSec: (id: string) => void;
}) {
  return (
    <div id="kategori-secici" className="mt-6">
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
              onClick={() => onSec(kat.id)}
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
  );
}

function SkorPaneli({
  konum,
  toplam,
  puan,
  onYeniden,
}: {
  konum: number;
  toplam: number;
  puan: number;
  onYeniden: () => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-koyu/60 sm:text-xs">
          İlerleme
        </p>
        <p className="font-heading text-2xl font-black sm:text-3xl">
          {konum}/{toplam}{" "}
          <span className="text-base font-medium text-koyu/50 sm:text-lg">
            kelime
          </span>
        </p>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-koyu/60 sm:text-xs">
          Puan
        </p>
        <p className="font-heading text-2xl font-black text-turuncu sm:text-3xl">
          {puan}
        </p>
      </div>
      <button
        type="button"
        onClick={onYeniden}
        className="rounded-full bg-koyu px-4 py-2 font-heading text-xs font-bold text-krem transition hover:bg-turuncu sm:text-sm"
      >
        ↻ Yeniden
      </button>
    </div>
  );
}

function BulmacaKart({
  aktif,
  girilenler,
  durumlar,
  kelimeTamam,
  inputRefs,
  onGiris,
}: {
  aktif: BulmacaKelimesi;
  girilenler: string[];
  durumlar: KutuDurum[];
  kelimeTamam: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onGiris: (idx: number, value: string) => void;
}) {
  const { kelime, gizliPozisyonlar } = aktif;
  const word = kelime.ku;
  const emoji = getKelimeEmojiByTr(kelime.tr, "📝");

  return (
    <div
      key={kelime.id}
      className={`animate-pop rounded-3xl border-2 bg-white p-6 text-center shadow-lg transition sm:p-10 ${
        kelimeTamam ? "border-emerald-500" : "border-koyu/10"
      }`}
    >
      <span className="text-6xl sm:text-7xl" aria-hidden>
        {emoji}
      </span>
      <p className="mt-3 font-heading text-xl font-extrabold text-koyu sm:text-2xl">
        {kelime.tr}
      </p>
      <p className="mt-1 text-sm text-koyu/50 sm:text-base">
        İpucu: <span className="italic">/{kelime.telaffuz}/</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {Array.from(word).map((ch, charIdx) => {
          const hidIdx = gizliPozisyonlar.indexOf(charIdx);
          if (hidIdx === -1) {
            return (
              <span
                key={charIdx}
                className="grid h-14 w-12 place-items-center rounded-2xl bg-koyu text-2xl font-extrabold uppercase text-krem sm:h-16 sm:w-14 sm:text-3xl"
              >
                {ch}
              </span>
            );
          }
          const durum = durumlar[hidIdx] ?? "bos";
          return (
            <input
              key={charIdx}
              ref={(el) => {
                inputRefs.current[hidIdx] = el;
              }}
              type="text"
              maxLength={1}
              value={girilenler[hidIdx] ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onGiris(hidIdx, e.target.value)
              }
              readOnly={durum === "dogru" || kelimeTamam}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              aria-label={`${hidIdx + 1}. eksik harf`}
              className={`h-14 w-12 rounded-2xl border-2 text-center text-2xl font-extrabold uppercase outline-none transition focus:scale-110 sm:h-16 sm:w-14 sm:text-3xl ${
                durum === "dogru"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : durum === "yanlis"
                    ? "animate-shake border-red-500 bg-red-50 text-red-700"
                    : "border-koyu/20 bg-white text-koyu focus:border-turuncu"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-5 h-9">
        {kelimeTamam ? (
          <p className="animate-pop inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 font-heading font-bold text-white shadow-md">
            <span aria-hidden>✓</span> Doğru! Sıradakine geçiliyor…
          </p>
        ) : (
          <p className="text-xs text-koyu/40 sm:text-sm">
            Boş kutulara doğru harfleri yaz.
          </p>
        )}
      </div>
    </div>
  );
}

function BitirmeModal({
  puan,
  toplam,
  onTekrar,
  onKategoriDegistir,
}: {
  puan: number;
  toplam: number;
  onTekrar: () => void;
  onKategoriDegistir: () => void;
}) {
  const maxPuan = toplam * ILK_DENEME_PUAN;
  const yuzde = maxPuan > 0 ? Math.round((puan / maxPuan) * 100) : 0;
  const mesaj =
    yuzde >= 90
      ? "Mükemmel! 🌟"
      : yuzde >= 70
        ? "Çok iyi! 🎉"
        : yuzde >= 50
          ? "Aferin, devam!"
          : "Tekrar dene, gelişeceksin!";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bitirme-baslik"
      className="fixed inset-0 z-50 grid place-items-center bg-koyu/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-3xl bg-krem p-8 text-center shadow-2xl">
        <p className="text-7xl" aria-hidden>
          🏆
        </p>
        <h2
          id="bitirme-baslik"
          className="mt-4 font-heading text-3xl font-black"
        >
          {mesaj}
        </h2>
        <p className="mt-3 font-heading text-5xl font-black text-turuncu">
          {puan}
          <span className="text-2xl text-koyu/40"> / {maxPuan}</span>
        </p>
        <p className="mt-1 text-sm text-koyu/60">{toplam} kelime tamamlandı</p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onTekrar}
            className="w-full rounded-full bg-turuncu px-6 py-3 font-heading font-bold text-krem shadow-lg shadow-turuncu/30 transition hover:-translate-y-0.5 hover:bg-koyu"
          >
            Tekrar Oyna
          </button>
          <button
            type="button"
            onClick={onKategoriDegistir}
            className="w-full rounded-full border-2 border-koyu/10 bg-white px-6 py-3 font-heading font-bold text-koyu transition hover:border-turuncu hover:text-turuncu"
          >
            Başka Kategori Dene
          </button>
        </div>
      </div>
    </div>
  );
}
