import videolarData from "@/data/videolar.json";

export interface VideoBaslik {
  ku: string;
  tr: string;
  en: string;
}

export interface VideoKategori {
  id: string;
  baslik: VideoBaslik;
  emoji: string;
}

export interface Video {
  id: string;
  baslik: VideoBaslik;
  kategori: string;
  youtube_id: string;
  sure_dakika: number;
  emoji: string;
  aciklama: VideoBaslik;
}

interface VideolarData {
  meta: { versiyon: string };
  kategoriler: VideoKategori[];
  videolar: Video[];
}

const data = videolarData as VideolarData;

export function getTumKategoriler(): VideoKategori[] {
  return data.kategoriler;
}

export function getKategori(id: string): VideoKategori | undefined {
  return data.kategoriler.find((k) => k.id === id);
}

export function getTumVideolar(): Video[] {
  return data.videolar;
}

export function getVideo(id: string): Video | undefined {
  return data.videolar.find((v) => v.id === id);
}

export function getVideolarByKategori(kategoriId: string): Video[] {
  return data.videolar.filter((v) => v.kategori === kategoriId);
}
