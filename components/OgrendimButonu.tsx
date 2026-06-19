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
  ogrendimText: string;
  ogrenildiText: string;
}

export function OgrendimButonu({
  dil,
  kelimeId,
  className = "",
  ogrendimText,
  ogrenildiText,
}: Props) {
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

  const ortakStil =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 font-heading text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300";
  const aktifStil = "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600";
  const pasifStil =
    "border-2 border-emerald-500 bg-white text-emerald-700 hover:bg-emerald-50";

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={`inline-block h-9 w-32 animate-pulse rounded-full bg-emerald-100 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={tikla}
      aria-pressed={ogrenildi}
      className={`${ortakStil} ${ogrenildi ? aktifStil : pasifStil} ${className}`}
    >
      <svg
        width="16"
        height="16"
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
      {ogrenildi ? ogrenildiText : ogrendimText}
    </button>
  );
}
