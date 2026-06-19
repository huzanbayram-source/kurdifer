import kurmanjiData from "@/data/kurmanji.json";
import zazacaData from "@/data/zazaca.json";

export type Dil = "kurmanji" | "zazaca";

const STORAGE_KEYS: Record<Dil, string> = {
  kurmanji: "kurdifer_progress_kurmanji",
  zazaca: "kurdifer_progress_zazaca",
};

export const PROGRESS_EVENT = "kurdifer-progress-change";

export interface Ilerleme {
  ogrenilen: number;
  toplam: number;
}

function read(dil: Dil): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS[dil]);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function write(dil: Dil, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS[dil], JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent(PROGRESS_EVENT, { detail: { dil } }),
    );
  } catch {
    // quota / private mode — sessizce yut
  }
}

export function markAsLearned(dil: Dil, kelimeId: string): void {
  const ids = read(dil);
  if (ids.includes(kelimeId)) return;
  write(dil, [...ids, kelimeId]);
}

export function unmarkAsLearned(dil: Dil, kelimeId: string): void {
  const ids = read(dil);
  if (!ids.includes(kelimeId)) return;
  write(
    dil,
    ids.filter((id) => id !== kelimeId),
  );
}

export function isLearned(dil: Dil, kelimeId: string): boolean {
  return read(dil).includes(kelimeId);
}

function kategoriKelimeIds(dil: Dil, kategoriId: string): string[] {
  const data = dil === "kurmanji" ? kurmanjiData : zazacaData;
  const kat = data.kategoriler.find((k) => k.id === kategoriId);
  return kat ? kat.kelimeler.map((k) => k.id) : [];
}

export function getKategoriToplam(dil: Dil, kategoriId: string): number {
  return kategoriKelimeIds(dil, kategoriId).length;
}

export function getProgress(dil: Dil, kategoriId: string): Ilerleme {
  const ids = kategoriKelimeIds(dil, kategoriId);
  const ogrenilenSet = new Set(read(dil));
  let ogrenilen = 0;
  for (const id of ids) if (ogrenilenSet.has(id)) ogrenilen++;
  return { ogrenilen, toplam: ids.length };
}

export function onProgressChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PROGRESS_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
