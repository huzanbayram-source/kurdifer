import Link from "next/link";
import type { Metadata } from "next";
import { DilSecici } from "@/components/DilSecici";
import { LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const YAYIN_TARIHI = "2026-06-19";
const SITE_URL = "https://kurdifer.app";
const SAYFA_URL = `${SITE_URL}/ebeveynler`;
const BASLIK =
  "Çocuğunuza Evde Kürtçe Nasıl Öğretirsiniz? Ebeveynler İçin Kapsamlı Rehber";
const ACIKLAMA =
  "Çocuğunuza Kürtçe (Kurmancî veya Kirmanckî) nasıl öğretirsiniz? Bilim, günlük rutin önerileri, KurdiFêr kullanım rehberi, sık yapılan hatalar ve diaspora aileler için pratik ipuçları.";

type ListeOge = { kalin?: string; metin: string };
type Paragraf = string | { tip: "liste"; ogeler: ListeOge[] };

interface Bolum {
  id: string;
  numara: number;
  baslik: string;
  paragraflar: Paragraf[];
}

const bolumler: Bolum[] = [
  {
    id: "giris",
    numara: 1,
    baslik: "Neden bu rehber gerekli?",
    paragraflar: [
      "Çocuğunuza Kürtçe öğretmek istiyorsunuz ama nereden başlayacağınızı bilmiyorsunuz. Yalnız değilsiniz. Türkiye'de, Avrupa'da ve dünyanın dört bir yanında binlerce ebeveyn aynı soruyu soruyor: Ana dilimi çocuğuma nasıl aktarırım?",
      "İyi haber şu: bilim erken yaşta iki dilliliği destekliyor. Üç ila yedi yaş arasındaki çocuklar yeni bir dili ana dilleri kadar derin öğrenebiliyor. Üstelik Kürtçe — Kurmancî veya Kirmanckî — sadece bir iletişim aracı değil. Ninelerin ninnili, dengbêjlerin stranlı, Newroz'un alevli bir kültürel mirasıdır. Çocuğunuza bu dili aktarmak, ona kim olduğunu hatırlatmaktır.",
      "Bu rehber size pratik adımlar verecek: hangi rutinler işe yarar, KurdiFêr'i nasıl kullanmalısınız, hangi tuzaklardan kaçınmalısınız ve diaspora ailelerinin neye dikkat etmesi gerektiğini.",
    ],
  },
  {
    id: "beyin",
    numara: 2,
    baslik: "Çocukların beyni dili öğrenirken ne yapar?",
    paragraflar: [
      "Doğumdan ergenliğe kadar geçen yıllar, dil öğrenimi için bir \"kritik dönem\" olarak bilinir. Bu dönemde çocuğun beyni dil sinyallerine olağanüstü duyarlıdır ve birden fazla dili paralel olarak ana dili gibi içselleştirebilir.",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Sinaptik budama",
            metin:
              "Beyin sık kullandığı sinir bağlantılarını güçlendirir, kullanılmayanları siler. Çocuk Kürtçe duymazsa, Kürtçeye ayrılmış nöral devreler zayıflar.",
          },
          {
            kalin: "Fonoloji penceresi",
            metin:
              "Yaklaşık yedi yaşına kadar çocuklar, yabancı bir dilin seslerini aksansız üretebilir. Bu pencere kapandıktan sonra mümkün olsa da daha zordur.",
          },
          {
            kalin: "Bilişsel esneklik",
            metin:
              "İki dilli çocuklar dikkat değiştirme, problem çözme ve duygusal düzenleme gibi yürütücü işlev testlerinde sıklıkla daha güçlü performans gösterir.",
          },
        ],
      },
      "Yani çocuğunuza Kürtçe öğretmek sadece bir kültürel borç değil, beyin gelişimine yapılan somut bir yatırımdır.",
    ],
  },
  {
    id: "ortam",
    numara: 3,
    baslik: "Evde Kürtçe konuşma ortamı nasıl yaratılır?",
    paragraflar: [
      "Tek bir altın kural vardır: çocuğun Kürtçe duyduğu süreyi artırın. Aşağıdaki yöntemler dünya çapındaki iki dilli aileler tarafından denenmiş ve işe yaradığı görülmüş yaklaşımlardır.",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Tek-ebeveyn-tek-dil (TETD)",
            metin:
              "Bir ebeveyn yalnızca Kürtçe konuşur, diğeri yerel dili kullanır. Tutarlılık her şeyden önemlidir; çocuk hangi sesi hangi yüzle ilişkilendireceğini öğrenir.",
          },
          {
            kalin: "Yere ve zamana göre dil",
            metin:
              "Yemek masasında Kürtçe, yatak odasında yerel dil gibi sınırlar koyun. Çocuk hangi ortamda hangi dilin geçerli olduğunu içselleştirir.",
          },
          {
            kalin: "Şarkı ve tekerleme",
            metin:
              "Müzik dili kalıcı kılar. Sabah rutinine bir Kürtçe çocuk şarkısı eklemek, dilin keyifle anılmasını sağlar.",
          },
          {
            kalin: "Yatak öncesi okuma",
            metin:
              "Kısa Kürtçe öyküler seçin. Her cümleyi kelime kelime çevirmek yerine resimleri işaret ederek bağlam kurun; çocuk anlamı kendi çıkarır.",
          },
          {
            kalin: "Dede-nine ile telefon",
            metin:
              "Haftalık görüntülü görüşmeler çocuğa dilin anlamlı bir kullanım amacı verir. Pratik için bundan daha doğal bir bağlam yoktur.",
          },
          {
            kalin: "Bayram ve kutlamalar",
            metin:
              "Newroz, Eyda Qurbanê, Eyda Remezanê — bu günler dilin kültürle örüldüğü zamanlardır. Hazırlık ve kutlamaları Kürtçe yapın.",
          },
        ],
      },
      "Unutmayın: günde 30 dakika tutarlı Kürtçe, ayda bir defa üç saatlik yoğun maruziyetten çok daha etkilidir. Süreklilik miktardan önemlidir.",
    ],
  },
  {
    id: "kurdifer",
    numara: 4,
    baslik: "KurdiFêr'i nasıl kullanmalı?",
    paragraflar: [
      "KurdiFêr çocuğunuzun Kürtçe yolculuğunda yanınızda olan ücretsiz bir öğrenme platformudur. Üç ana özelliği vardır:",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Kelime kartları",
            metin:
              "8 kategoride 127 kelime: hayvanlar, renkler, sayılar, meyveler, aile, ev, hava ve yiyecekler. Her kartta Kurmancî yazımı, Türkçe karşılığı, telaffuz rehberi ve örnek bir cümle bulunur. Hoparlör butonu sayesinde çocuk doğru sesi duyarak öğrenir.",
          },
          {
            kalin: "Eşleştirme oyunu",
            metin:
              "6 kelimenin Kurmancî adıyla emojisini eşleştiren bir bellek oyunu. Hem eğlenir hem öğrenir; oyun motivasyonu öğrenmenin önündeki en büyük engeli kaldırır.",
          },
          {
            kalin: "İlerleme takibi",
            metin:
              "Her kelimenin yanında \"Öğrendim\" butonu vardır. Çocuğun ilerlemesi tarayıcıda saklanır; kayıt gerekmez. Kategorilerin yanındaki yeşil çubuk, küçük kazanımları görünür kılar.",
          },
        ],
      },
      "Önerilen rutin: günde 5-10 dakika. Üç yeni kelime öğrenin, sesli telaffuzu tekrar edin, sonunda bir tur eşleştirme oyunu oynayın. Çocuk konuya doyduğunda zorlamayın; ertesi güne bırakın. Sabır bu yolculuğun en güçlü pedagojik aracıdır.",
    ],
  },
  {
    id: "lehceler",
    numara: 5,
    baslik: "Kurmancî mi, Kirmanckî (Zazakî) mı?",
    paragraflar: [
      "Türkiye coğrafyasında konuşulan iki ana Kürtçe varyantı vardır ve hangisini seçeceğiniz çoğu zaman ailenizin kökeniyle belirlenir.",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Kurmancî",
            metin:
              "En yaygın Kürtçe lehçesi. Türkiye'nin doğu ve güneydoğusu, Suriye'nin kuzeyi, Kuzey Irak ve Avrupa diasporasında konuşulur. Hawar (Latin) alfabesiyle yazılır. Yaklaşık 15-20 milyon konuşurla en büyük varyanttır.",
          },
          {
            kalin: "Kirmanckî (Zazakî)",
            metin:
              "Tunceli, Bingöl, Diyarbakır ve Elazığ bölgelerinde konuşulur. Bazı dilbilimciler bunu ayrı bir dil sayar; tarihsel olarak Kurmancî'den farklı bir yol izlemiştir. Konuşur sayısı yaklaşık 3-4 milyondur.",
          },
        ],
      },
      "Doğru cevap basit: ailenizin lehçesini seçin. Çocuk önce bu dili dedesinden, ninesinden, akrabalarından duyacak. KurdiFêr her ikisini de sunar; istediğiniz lehçeyle başlayın, hatta isterseniz haftanın bazı günlerini birine, bazı günlerini diğerine ayırın. Çocuklar birden fazla varyantla büyümeye sandığınızdan çok daha uyumludur.",
    ],
  },
  {
    id: "diaspora",
    numara: 6,
    baslik: "Diaspora aileleri için özel ipuçları",
    paragraflar: [
      "Almanya, İsveç, Hollanda, Fransa, Belçika, Birleşik Krallık — Kürt diasporasının yoğun olduğu ülkelerde büyüyen çocuklar için ek özen göstermek gerekir.",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Çoğunluk dilinin baskısı",
            metin:
              "Çocuk Almancayı, Felemenkçeyi veya Fransızcayı okulda, sokakta, oyun arkadaşlarıyla yaşar. Evde Kürtçeyi de aynı doğallıkla yaşamazsa, çocuğun pasif anlayışı bile yıllar içinde kaybolur.",
          },
          {
            kalin: "Onur, utanç değil",
            metin:
              "Çocuğa Kürtçe konuşmasının havalı ve özel olduğunu hissettirin. \"Bizim güzel dilimiz\" çerçevesi, onun kimlik gelişimi için kritiktir.",
          },
          {
            kalin: "Topluluk bağı",
            metin:
              "Kürt dernekleri, kültür merkezleri ve online sohbet grupları çocuğa yalnız olmadığını gösterir. Yaşıt arkadaşlarıyla Kürtçe konuşması, evdeki diyalogdan çok daha güçlü bir motivasyondur.",
          },
          {
            kalin: "Yıllık ziyaret",
            metin:
              "Mümkünse her yıl ataların yaşadığı bölgeye seyahat edin. İki haftada çocuğun pratiği aylar süren ev derslerinden daha hızlı gelişir.",
          },
          {
            kalin: "Dijital içerik",
            metin:
              "Zarok TV, Kurdmax Kids ve YouTube'da Kürtçe çocuk programları bulunur. Ekran zamanını düşmana çevirmek yerine müttefik yapın; pasif maruziyet bile değerlidir.",
          },
        ],
      },
      "Diaspora çocuğu için ana dil, fiziksel bir ev kadar gerçek bir aidiyet evidir. O evi açık tutmak ebeveynin en güzel armağanıdır.",
    ],
  },
  {
    id: "hatalar",
    numara: 7,
    baslik: "Sık yapılan hatalar ve nasıl kaçınılır?",
    paragraflar: [
      "Aşağıdaki tuzaklar en iyi niyetli ebeveynlerin bile düşebileceği yaygın hatalardır. Önceden bilirseniz baştan kaçınabilirsiniz.",
      {
        tip: "liste",
        ogeler: [
          {
            kalin: "Çevirmen olmak",
            metin:
              "\"Yorgun musun? — Tu westiyayî?\" gibi her cümleyi çift dilde söylemek. Çocuk Kürtçeyi bağımsız bir sistem olarak değil, Türkçenin gölgesi olarak öğrenir. Bağlamı doğrudan Kürtçe kurun.",
          },
          {
            kalin: "Sürekli düzeltme",
            metin:
              "Çocuğun küçük hatalarını anında düzeltmek cesaretini kırar. Doğru cümleyi modelleyerek tekrarlayın; çocuk farkı kendi yakalayacaktır.",
          },
          {
            kalin: "Tutarsızlık",
            metin:
              "Bugün Kürtçe, yarın Türkçe, sonraki gün karışık. Çocuk hangi dilin ne zaman geçerli olduğunu bilemez ve ikisinden de geri çekilir.",
          },
          {
            kalin: "Karşılaştırma",
            metin:
              "\"Komşunun çocuğu çok güzel konuşuyor\" demeyin. Her çocuğun dil ritmi kendine özeldir; karşılaştırma motivasyonu öldürür.",
          },
          {
            kalin: "Erken vazgeçme",
            metin:
              "İlk yıl çocuk Kürtçe konuşmayabilir ama büyük olasılıkla anlıyordur. Bu \"pasif aşama\" doğal ve gereklidir; üretim için sabredin.",
          },
          {
            kalin: "Dili \"zor\" diye sunmak",
            metin:
              "Çocuğun yanında \"Kürtçe çok zor\" demek dilin önüne görünmez bir duvar örer. Onun yerine \"bizim güzel ve özel dilimiz\" çerçevesini kullanın.",
          },
        ],
      },
    ],
  },
  {
    id: "sonuc",
    numara: 8,
    baslik: "Hemen başlayın",
    paragraflar: [
      "Çocuğunuza Kürtçe öğretmek bir maratondur, sprint değil. Bugün üç kelime öğretin. Yarın bir Kürtçe ninni söyleyin. Sonraki hafta dede-nine ile telefonda Kürtçe konuşturun. Bu küçük adımlar yıllar içinde köklü bir aktarım haline gelir.",
      "KurdiFêr ücretsizdir, kayıt gerekmez. Tarayıcınızdan açın, çocuğunuzla birlikte ilk kelimeyi öğrenin. Yarın da, ondan sonraki gün de buradayız.",
    ],
  },
];

function kelimeSay(): number {
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

const TOPLAM_KELIME = kelimeSay();
const OKUMA_DAKIKA = Math.max(1, Math.ceil(TOPLAM_KELIME / 200));

const TURKCE_TARIH = new Date(YAYIN_TARIHI).toLocaleDateString("tr-TR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const metadata: Metadata = {
  title: `${BASLIK} | KurdiFêr`,
  description: ACIKLAMA,
  keywords: [
    "Kürtçe öğretmek",
    "çocuğa Kürtçe öğretme",
    "Kurmancî öğren",
    "Zazakî öğren",
    "Kirmanckî",
    "iki dilli çocuk",
    "diaspora",
    "ana dil",
    "ebeveyn rehberi",
    "KurdiFêr",
  ],
  authors: [{ name: "KurdiFêr" }],
  alternates: { canonical: SAYFA_URL },
  openGraph: {
    title: BASLIK,
    description: ACIKLAMA,
    type: "article",
    locale: "tr_TR",
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
        alt: "Çocuklara Kürtçe öğretme rehberi — KurdiFêr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BASLIK,
    description: ACIKLAMA,
    images: [`${SITE_URL}/og-ebeveynler.png`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: BASLIK,
  description: ACIKLAMA,
  author: {
    "@type": "Organization",
    name: "KurdiFêr",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "KurdiFêr",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
  datePublished: YAYIN_TARIHI,
  dateModified: YAYIN_TARIHI,
  image: [`${SITE_URL}/og-ebeveynler.png`],
  inLanguage: "tr-TR",
  wordCount: TOPLAM_KELIME,
  timeRequired: `PT${OKUMA_DAKIKA}M`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": SAYFA_URL,
  },
};

export default function EbeveynlerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;
  return (
    <main className="min-h-screen bg-krem text-koyu">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar locale={locale} />

      <article>
        <Hero locale={locale} />
        <Icindekiler />
        <MakaleGovde />
        <SonCTA locale={locale} />
      </article>

      <Footer />
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

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-koyu/60 transition hover:text-turuncu"
      >
        <span aria-hidden>‹</span> Anasayfa
      </Link>

      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-sari/40 px-4 py-1.5 font-heading text-sm font-bold text-koyu">
        <span aria-hidden>👨‍👩‍👧</span> Ebeveyn Rehberi
      </span>

      <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-balance sm:text-5xl lg:text-6xl">
        Çocuğunuza Evde{" "}
        <span className="text-turuncu">Kürtçe</span> Nasıl Öğretirsiniz?
      </h1>

      <p className="mt-3 text-base text-koyu/70 sm:text-lg">
        Ebeveynler için kapsamlı rehber: bilim, günlük rutinler, doğru
        araçlar ve sık yapılan hatalar.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-koyu/60">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>🕐</span>
          <span>{OKUMA_DAKIKA} dakika okuma</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>📅</span>
          <time dateTime={YAYIN_TARIHI}>{TURKCE_TARIH}</time>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>✍️</span>
          <span>KurdiFêr Editöryal Ekibi</span>
        </span>
      </div>
    </section>
  );
}

function Icindekiler() {
  return (
    <nav
      aria-label="İçindekiler"
      className="mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl border-2 border-koyu/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="font-heading text-xs font-bold uppercase tracking-wider text-turuncu">
          İçindekiler
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

function MakaleGovde() {
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

function SonCTA({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto mt-16 max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="rounded-3xl bg-koyu p-8 text-center text-krem shadow-xl sm:p-10">
        <p className="text-5xl" aria-hidden>
          🌱
        </p>
        <h2 className="mt-4 font-heading text-3xl font-black sm:text-4xl">
          Hemen ücretsiz başlayın
        </h2>
        <p className="mx-auto mt-3 max-w-md text-krem/75 sm:text-lg">
          Kayıt gerekmez. Tarayıcınızı açın, çocuğunuzla ilk Kürtçe kelimenizi
          bugün öğrenin.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}`}
            className="w-full rounded-full bg-turuncu px-7 py-3 font-heading font-bold text-krem shadow-lg shadow-turuncu/30 transition hover:-translate-y-0.5 hover:bg-sari hover:text-koyu sm:w-auto"
          >
            Kurmancî ile başla
          </Link>
          <Link
            href={`/${locale}/zazaca`}
            className="w-full rounded-full border-2 border-krem/30 bg-koyu px-7 py-3 font-heading font-bold text-krem transition hover:border-turuncu hover:text-turuncu sm:w-auto"
          >
            Zazakî ile başla
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-koyu/10 bg-krem">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-koyu/60 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-heading font-bold text-koyu">KurdiFêr</span>
        </p>
        <p>Bi hezkirinê hatiye çêkirin · Sevgiyle yapıldı</p>
      </div>
    </footer>
  );
}
