export interface SpeakOptions {
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

function getVoicesSafe(): SpeechSynthesisVoice[] {
  try {
    return window.speechSynthesis.getVoices() ?? [];
  } catch {
    return [];
  }
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = getVoicesSafe();
  if (voices.length === 0) return null;

  const matchBy = (matcher: (lang: string) => boolean) =>
    voices.find((v) => matcher(v.lang.toLowerCase()));

  return (
    matchBy((l) => l === "ku-tr") ||
    matchBy((l) => l.startsWith("ku-")) ||
    matchBy((l) => l === "ku") ||
    matchBy((l) => l === "tr-tr") ||
    matchBy((l) => l.startsWith("tr-")) ||
    matchBy((l) => l === "tr") ||
    null
  );
}

export function speakKurmanji(text: string, opts: SpeakOptions = {}): void {
  if (!isSpeechSupported() || !text) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts.rate ?? 0.85;
  utter.pitch = 1;

  const voice = pickVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "tr-TR";
  }

  if (opts.onStart) utter.onstart = opts.onStart;
  if (opts.onEnd) utter.onend = opts.onEnd;
  if (opts.onError) utter.onerror = opts.onError;

  synth.speak(utter);
}
