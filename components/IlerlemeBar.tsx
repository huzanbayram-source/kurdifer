"use client";

import { useEffect, useState } from "react";
import {
  type Dil,
  getProgress,
  getKategoriToplam,
  onProgressChange,
} from "@/lib/progress";

interface Props {
  dil: Dil;
  kategoriId: string;
  koyuKart?: boolean;
}

export function IlerlemeBar({ dil, kategoriId, koyuKart = false }: Props) {
  const [progress, setProgress] = useState({
    ogrenilen: 0,
    toplam: getKategoriToplam(dil, kategoriId),
  });

  useEffect(() => {
    const refresh = () => setProgress(getProgress(dil, kategoriId));
    refresh();
    return onProgressChange(refresh);
  }, [dil, kategoriId]);

  const { ogrenilen, toplam } = progress;
  const yuzde = toplam > 0 ? Math.round((ogrenilen / toplam) * 100) : 0;

  const trackBg = koyuKart ? "bg-white/20" : "bg-koyu/10";
  const textRenk = koyuKart ? "text-krem/80" : "text-koyu/70";

  return (
    <div className="mt-3" aria-label={`${ogrenilen} / ${toplam} öğrenildi`}>
      <div
        className={`h-1.5 w-full overflow-hidden rounded-full ${trackBg}`}
        role="progressbar"
        aria-valuenow={ogrenilen}
        aria-valuemin={0}
        aria-valuemax={toplam}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${yuzde}%` }}
        />
      </div>
      <p className={`mt-1.5 text-xs font-semibold ${textRenk}`}>
        {ogrenilen}/{toplam} öğrenildi
      </p>
    </div>
  );
}
