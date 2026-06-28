import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import videolarData from "@/data/videolar.json";
import {
  getKategori,
  getVideo,
  getVideolarByKategori,
  getVideoNavigation,
} from "@/lib/videolar";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, localeAd, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    videolarData.videolar.map((v) => ({ locale, id: v.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string };
}): Promise<Metadata> {
  const video = getVideo(params.id);
  if (!video) return { title: "—" };
  return {
    title: `${localeAd(video.baslik, params.locale)} — KurdiFêr`,
    description: localeAd(video.aciklama, params.locale),
  };
}

export default async function VideoSayfa({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const video = getVideo(params.id);
  if (!video) notFound();
  const dict = await getDictionary(params.locale);
  const locale = params.locale;
  const kategori = getKategori(video.kategori);
  const benzerVideolar = getVideolarByKategori(video.kategori)
    .filter((v) => v.id !== video.id)
    .slice(0, 3);
  const { prev, next } = getVideoNavigation(video);
  const yakinda = !video.youtube_id;
  const baslik = localeAd(video.baslik, locale);
  const aciklama = localeAd(video.aciklama, locale);
  const izleme = dict.video_izleme;

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
              href={`/${locale}/videolar`}
              className="hidden rounded-full px-3 py-2 font-heading text-sm font-bold text-koyu/80 transition hover:bg-sari/40 hover:text-koyu sm:inline-flex"
            >
              ← {izleme.geri_link}
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

      <section className="mx-auto max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <Link
          href={`/${locale}/videolar`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-koyu/60 transition hover:text-turuncu"
        >
          <span aria-hidden>‹</span> {izleme.geri_link}
        </Link>

        <div className="mt-5 overflow-hidden rounded-3xl border-2 border-koyu/10 bg-white shadow-lg">
          {yakinda ? (
            <YakindaBlok izleme={izleme} emoji={video.emoji} />
          ) : (
            <div className="relative aspect-video w-full bg-koyu">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?rel=0`}
                title={baslik}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                {kategori && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sari/40 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-koyu">
                    <span aria-hidden>{kategori.emoji}</span>
                    {localeAd(kategori.baslik, locale)}
                  </span>
                )}
                <h1 className="mt-3 font-heading text-2xl font-black leading-tight sm:text-3xl">
                  {baslik}
                </h1>
              </div>
              <span
                className="shrink-0 rounded-full bg-koyu/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-koyu"
              >
                🕐 {video.sure_dakika} {dict.videolar_sayfa.dakika}
              </span>
            </div>

            <div className="mt-5 border-t border-koyu/10 pt-5">
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-turuncu">
                {izleme.aciklama_etiketi}
              </p>
              <p className="mt-2 text-base leading-relaxed text-koyu/80 sm:text-lg">
                {aciklama}
              </p>
            </div>
          </div>
        </div>
      </section>

      {video.harfler && video.harfler.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black sm:text-3xl">
            🔤 {locale === "ku" ? "Tîpên vê dersê" : locale === "tr" ? "Bu dersin harfleri" : "Letters in this lesson"}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {video.harfler.map((h) => (
              <div
                key={h.harf}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-koyu/10 bg-white p-4 shadow-sm"
              >
                <span className="font-heading text-4xl font-black text-turuncu">{h.harf}</span>
                <span className="text-3xl" aria-hidden>{h.emoji}</span>
                <span className="font-heading text-sm font-bold text-koyu">{h.ornek_ku}</span>
                <span className="text-xs font-semibold text-koyu/50">{h.ornek_tr}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <section className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {prev ? (
              <Link
                href={`/${locale}/videolar/${prev.id}`}
                className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-koyu/10 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>‹</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-koyu/50">
                    {locale === "ku" ? "Ya berê" : locale === "tr" ? "Önceki" : "Previous"}
                  </p>
                  <p className="truncate font-heading text-sm font-bold text-koyu">
                    {prev.baslik[locale as "ku" | "tr" | "en"]}
                  </p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {next ? (
              <Link
                href={`/${locale}/videolar/${next.id}`}
                className="flex flex-1 items-center justify-end gap-3 rounded-2xl border-2 border-turuncu/40 bg-turuncu/10 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="min-w-0 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-koyu/50">
                    {locale === "ku" ? "Ya pêş" : locale === "tr" ? "Sıradaki" : "Next"}
                  </p>
                  <p className="truncate font-heading text-sm font-bold text-koyu">
                    {next.baslik[locale as "ku" | "tr" | "en"]}
                  </p>
                </div>
                <span className="text-2xl" aria-hidden>›</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </section>
      )}

      {benzerVideolar.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 lg:px-8">
          <h2 className="font-heading text-2xl font-black sm:text-3xl">
            {izleme.ayni_kategori}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {benzerVideolar.map((v) => (
              <Link
                key={v.id}
                href={`/${locale}/videolar/${v.id}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-koyu/10 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full bg-gradient-to-br from-koyu via-koyu to-turuncu/60">
                  <div className="absolute inset-0 grid place-items-center">
                    <span
                      className="text-5xl transition-transform group-hover:scale-110 sm:text-6xl"
                      aria-hidden
                    >
                      {v.emoji}
                    </span>
                  </div>
                  {!v.youtube_id && (
                    <div className="absolute left-2 top-2 rounded-full bg-koyu px-2.5 py-0.5 font-heading text-[10px] font-bold text-krem">
                      {dict.videolar_sayfa.yakinda_rozet}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-heading text-sm font-extrabold leading-snug text-koyu sm:text-base">
                    {localeAd(v.baslik, locale)}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-koyu/50">
                    🕐 {v.sure_dakika} {dict.videolar_sayfa.dakika}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-koyu/10 bg-krem">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-koyu/60 sm:flex-row sm:px-6 lg:px-8">
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

function YakindaBlok({
  izleme,
  emoji,
}: {
  izleme: {
    yakinda_baslik: string;
    yakinda_emoji: string;
    yakinda_altyazi: string;
    yakinda_buton: string;
  };
  emoji: string;
}) {
  return (
    <div className="grid aspect-video w-full place-items-center bg-gradient-to-br from-koyu via-koyu to-turuncu/60 p-6 text-center text-krem">
      <div>
        <p className="text-6xl sm:text-7xl" aria-hidden>
          {emoji}
        </p>
        <p className="mt-4 text-3xl" aria-hidden>
          {izleme.yakinda_emoji}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-black leading-tight sm:text-3xl">
          {izleme.yakinda_baslik}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-krem/80 sm:text-base">
          {izleme.yakinda_altyazi}
        </p>
      </div>
    </div>
  );
}
