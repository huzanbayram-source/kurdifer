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

export interface Harf {
  harf: string;
  ornek_ku: string;
  ornek_tr: string;
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
  harfler?: Harf[];
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

export function getVideoNavigation(video: Video): { prev: Video | null; next: Video | null } {
  const katVideolar = getVideolarByKategori(video.kategori);
  const idx = katVideolar.findIndex((v) => v.id === video.id);
  return {
    prev: idx > 0 ? katVideolar[idx - 1] : null,
    next: idx < katVideolar.length - 1 ? katVideolar[idx + 1] : null,
  };
}
