"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { isSpeechSupported, speakKurmanji } from "@/lib/speak";

interface Props {
  text: string;
  className?: string;
  ariaLabel?: string;
}

export function SesButonu({ text, className = "", ariaLabel }: Props) {
  const [mounted, setMounted] = useState(false);
  const [konusuyor, setKonusuyor] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (isSpeechSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  if (!mounted || !isSpeechSupported()) return null;

  function tikla(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    speakKurmanji(text, {
      onStart: () => setKonusuyor(true),
      onEnd: () => setKonusuyor(false),
      onError: () => setKonusuyor(false),
    });
  }

  return (
    <button
      type="button"
      onClick={tikla}
      aria-label={ariaLabel ?? `${text} kelimesini dinle`}
      aria-pressed={konusuyor}
      className={`grid place-items-center rounded-full bg-turuncu text-krem shadow-md transition focus:outline-none focus-visible:ring-4 focus-visible:ring-turuncu/50 ${
        konusuyor
          ? "scale-110 animate-pulse"
          : "hover:scale-110 active:scale-95"
      } ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
