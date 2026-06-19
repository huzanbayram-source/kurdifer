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
  baslikText: string;
  tamamlandiText: string;
  tamamlandiMesaj: string;
}

export function IlerlemePanel({
  dil,
  kategoriId,
  baslikText,
  tamamlandiText,
  tamamlandiMesaj,
}: Props) {
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
  const tamamlandi = toplam > 0 && ogrenilen === toplam;

  return (
    <div className="mt-6 rounded-2xl border-2 border-koyu/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-xl sm:text-2xl">
            {tamamlandi ? "🏆" : "🎯"}
          </span>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-koyu/70 sm:text-base">
            {baslikText}
          </p>
        </div>
        <p className="font-heading text-xl font-black text-koyu sm:text-2xl">
          <span className="text-emerald-600">{ogrenilen}</span>
          <span className="text-koyu/40"> / {toplam}</span>
        </p>
      </div>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-koyu/10"
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

      <p className="mt-2 text-xs font-semibold text-koyu/60 sm:text-sm">
        {tamamlandi ? tamamlandiMesaj : `%${yuzde} ${tamamlandiText}`}
      </p>
    </div>
  );
}
