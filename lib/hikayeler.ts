import hikayelerData from "@/data/hikayeler.json";

export type HikayeSeviye = "kolay" | "orta" | "zor";

export interface HikayeBaslik {
  ku: string;
  tr: string;
  en: string;
}

export interface HikayeSayfa {
  ku: string;
  tr: string;
  emoji: string;
}

export interface Hikaye {
  id: string;
  baslik: HikayeBaslik;
  kategori: string;
  seviye: HikayeSeviye;
  emoji: string;
  sure_dakika: number;
  ses: string;
  kapak_gorsel: string;
  sayfalar: HikayeSayfa[];
}

interface HikayelerData {
  meta: { versiyon: string };
  hikayeler: Hikaye[];
}

const data = hikayelerData as HikayelerData;

export function getHikaye(id: string): Hikaye | undefined {
  return data.hikayeler.find((h) => h.id === id);
}

export function getTumHikayeler(): Hikaye[] {
  return data.hikayeler;
}
