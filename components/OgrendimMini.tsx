"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  type Dil,
  isLearned,
  markAsLearned,
  unmarkAsLearned,
  onProgressChange,
} from "@/lib/progress";

interface Props {
  dil: Dil;
  kelimeId: string;
  className?: string;
}

export function OgrendimMini({ dil, kelimeId, className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [ogrenildi, setOgrenildi] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOgrenildi(isLearned(dil, kelimeId));
    return onProgressChange(() => {
      setOgrenildi(isLearned(dil, kelimeId));
    });
  }, [dil, kelimeId]);

  function tikla(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (ogrenildi) {
      unmarkAsLearned(dil, kelimeId);
      setOgrenildi(false);
    } else {
      markAsLearned(dil, kelimeId);
      setOgrenildi(true);
    }
  }

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={`grid place-items-center rounded-full border-2 border-koyu/10 bg-white/70 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={tikla}
      aria-pressed={ogrenildi}
      aria-label={
        ogrenildi
          ? "Öğrenildi işaretini kaldır"
          : "Öğrenildi olarak işaretle"
      }
      title={ogrenildi ? "Öğrenildi ✓" : "Öğrendim olarak işaretle"}
      className={`grid place-items-center rounded-full shadow-md transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
        ogrenildi
          ? "scale-100 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
          : "border-2 border-koyu/15 bg-white text-koyu/30 hover:scale-110 hover:border-emerald-500 hover:text-emerald-500 active:scale-95"
      } ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  );
}
