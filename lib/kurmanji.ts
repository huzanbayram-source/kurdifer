import kurmanjiData from "@/data/kurmanji.json";

export type Seviye = "kolay" | "orta" | "zor";

export interface OrnekCumle {
  ku: string;
  tr: string;
}

export interface Kelime {
  id: string;
  ku: string;
  tr: string;
  en: string;
  telaffuz: string;
  ses: string;
  gorsel: string;
  ornek_cumle: OrnekCumle;
}

export interface Kategori {
  id: string;
  tr: string;
  ku: string;
  en: string;
  emoji: string;
  seviye: Seviye;
  kelimeler: Kelime[];
}

export interface KurmanjiMeta {
  dil: string;
  versiyon: string;
  guncelleme: string;
}

export interface KurmanjiData {
  meta: KurmanjiMeta;
  kategoriler: Kategori[];
}

const data = kurmanjiData as KurmanjiData;

export function getKategori(id: string): Kategori | undefined {
  return data.kategoriler.find((k) => k.id === id);
}

export function getTumKelimeler(): Kelime[] {
  return data.kategoriler.flatMap((k) => k.kelimeler);
}
