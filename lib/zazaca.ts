import zazacaData from "@/data/zazaca.json";
import type { Kategori, Kelime, KurmanjiData } from "@/lib/kurmanji";

const data = zazacaData as KurmanjiData;

export function getZazacaKategori(id: string): Kategori | undefined {
  return data.kategoriler.find((k) => k.id === id);
}

export function getTumZazacaKelimeler(): Kelime[] {
  return data.kategoriler.flatMap((k) => k.kelimeler);
}
