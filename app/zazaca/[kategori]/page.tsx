import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getZazacaKategori } from "@/lib/zazaca";
import { getKelimeEmojiByTr } from "@/lib/kelime-emoji";
import zazacaData from "@/data/zazaca.json";
import { KelimeKart } from "@/app/kurmanji/[kategori]/KelimeKart";
import { IlerlemePanel } from "@/components/IlerlemePanel";

const seviyeRozet: Record<string, string> = {
  kolay: "bg-sari/40 text-koyu",
  orta: "bg-turuncu/20 text-turuncu",
  zor: "bg-koyu text-krem",
};

export function generateStaticParams() {
  return zazacaData.kategoriler.map((k) => ({ kategori: k.id }));
}

export function generateMetadata({
  params,
}: {
  params: { kategori: string };
}): Metadata {
  const kategori = getZazacaKategori(params.kategori);
  if (!kategori) return { title: "Kategori bulunamadı — KurdiFêr" };
  return {
    title: `${kategori.tr} (${kategori.ku}) Zazaca — KurdiFêr`,
    description: `Zazaca ${kategori.tr.toLowerCase()} kategorisinde ${kategori.kelimeler.length} kelime, telaffuzu ve örnek cümleleriyle.`,
  };
}

export default function ZazacaKategoriPage({
  params,
}: {
  params: { kategori: string };
}) {
  const kategori = getZazacaKategori(params.kategori);
  if (!kategori) notFound();

  return (
    <main className="min-h-screen bg-krem text-koyu">
      <header className="sticky top-0 z-30 border-b border-koyu/10 bg-krem/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-turuncu text-xl">
              🌟
            </span>
            <span className="font-heading text-2xl font-extrabold tracking-tight">
              Kurdi<span className="text-turuncu">Fêr</span>
            </span>
          </Link>

          <Link
            href="/zazaca"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-heading text-sm font-bold text-koyu shadow-sm transition hover:bg-koyu hover:text-krem"
          >
            <span aria-hidden>←</span> Tüm kategoriler
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <Link
          href="/zazaca"
          className="inline-flex items-center gap-1 text-sm font-semibold text-koyu/60 transition hover:text-turuncu"
        >
          <span aria-hidden>‹</span> Tüm Zazaca kategorileri
        </Link>

        <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-turuncu text-5xl shadow-lg shadow-turuncu/30 sm:h-24 sm:w-24 sm:text-6xl">
            {kategori.emoji}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider ${
                  seviyeRozet[kategori.seviye] ?? seviyeRozet.kolay
                }`}
              >
                {kategori.seviye}
              </span>
              <span className="inline-block rounded-full bg-koyu/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-koyu">
                Zazaca
              </span>
            </div>
            <h1 className="mt-2 font-heading text-4xl font-black leading-tight sm:text-5xl">
              {kategori.tr}{" "}
              <span className="text-turuncu">({kategori.ku})</span>
            </h1>
            <p className="mt-2 text-base text-koyu/70 sm:text-lg">
              {kategori.kelimeler.length} kelime · Bir karta dokun, örnek cümleyi
              gör.
            </p>
          </div>
        </div>

        <IlerlemePanel dil="zazaca" kategoriId={kategori.id} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {kategori.kelimeler.map((kelime) => (
            <KelimeKart
              key={kelime.id}
              kelime={kelime}
              emoji={getKelimeEmojiByTr(kelime.tr, kategori.emoji)}
              dil="zazaca"
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
          <p>Bi hezkirinê hatiye çêkirin · Sevgiyle yapıldı</p>
        </div>
      </footer>
    </main>
  );
}
