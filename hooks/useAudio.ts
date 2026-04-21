"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPlayingVoiceId,
  playVoice,
  subscribe,
} from "@/lib/audioController";

export function useAudio() {
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPlayingVoiceId(getPlayingVoiceId());
    return subscribe(() => setPlayingVoiceId(getPlayingVoiceId()));
  }, []);

  const play = useCallback(async (voiceId: string, text: string) => {
    setError(null);
    setLoadingVoiceId(voiceId);
    try {
      await playVoice(voiceId, text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Playback failed");
    } finally {
      setLoadingVoiceId(null);
    }
  }, []);

  return { play, loadingVoiceId, playingVoiceId, error };
}
