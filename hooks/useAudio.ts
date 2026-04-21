"use client";

import { useCallback, useRef, useState } from "react";

const urlCache = new Map<string, string>();

export function useAudio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (voiceId: string, text: string) => {
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const key = `${voiceId}:${text}`;
    let url = urlCache.get(key);

    if (!url) {
      setLoading(true);
      try {
        const resp = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voiceId, text }),
        });
        if (!resp.ok) {
          const body = await resp.text().catch(() => "");
          throw new Error(body || `TTS failed (${resp.status})`);
        }
        const blob = await resp.blob();
        url = URL.createObjectURL(blob);
        urlCache.set(key, url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Audio failed");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    try {
      await audio.play();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Playback failed");
    }
  }, []);

  return { play, loading, error };
}
