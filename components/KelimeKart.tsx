"use client";

import { useState } from "react";
import type { Kelime } from "@/lib/kurmanji";
import type { Dil } from "@/lib/progress";
import { SesButonu } from "@/components/SesButonu";
import { OgrendimButonu } from "@/components/OgrendimButonu";
import { OgrendimMini } from "@/components/OgrendimMini";

export interface KelimeKartLabels {
  ornek_cumle: string;
  ogrendim: string;
  ogrenildi: string;
  isaretle: string;
  kaldir: string;
}

interface Props {
  kelime: Kelime;
  emoji: string;
  dil: Dil;
  ceviri: string;
  labels: KelimeKartLabels;
}

export function KelimeKart({ kelime, emoji, dil, ceviri, labels }: Props) {
  const [acik, setAcik] = useState(false);

  return (
    <div
      className={`relative rounded-3xl border-2 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl ${
        acik ? "border-turuncu" : "border-koyu/10"
      }`}
    >
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        aria-expanded={acik}
        aria-label={kelime.ku}
        className="block w-full p-5 pr-20 text-left sm:p-6 sm:pr-24"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-krem text-4xl shadow-inner sm:h-20 sm:w-20 sm:text-5xl">
            {emoji}
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-heading text-2xl font-extrabold text-koyu sm:text-3xl">
              {kelime.ku}
            </p>
            <p className="mt-0.5 text-base font-medium text-koyu/70 sm:text-lg">
              {ceviri}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sari/40 px-3 py-1 text-xs font-semibold text-koyu sm:text-sm">
              <span className="italic">/{kelime.telaffuz}/</span>
            </p>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          acik ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="rounded-2xl bg-krem p-4 sm:p-5">
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-turuncu">
                {labels.ornek_cumle}
              </p>
              <p className="mt-2 font-heading text-lg font-bold text-koyu sm:text-xl">
                {kelime.ornek_cumle.ku}
              </p>
              <p className="mt-1 text-sm text-koyu/70 sm:text-base">
                {kelime.ornek_cumle.tr}
              </p>
              <div className="mt-4">
                <OgrendimButonu
                  dil={dil}
                  kelimeId={kelime.id}
                  ogrendimText={labels.ogrendim}
                  ogrenildiText={labels.ogrenildi}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 sm:right-5 sm:top-5">
        <SesButonu
          text={kelime.ku}
          ariaLabel={kelime.ku}
          className="h-11 w-11 sm:h-12 sm:w-12"
        />
        <OgrendimMini
          dil={dil}
          kelimeId={kelime.id}
          isaretleText={labels.isaretle}
          kaldirText={labels.kaldir}
          className="h-11 w-11 sm:h-12 sm:w-12"
        />
      </div>
    </div>
  );
}
