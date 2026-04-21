"use client";

import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { SAMPLE_TEXT, type Voice } from "@/lib/voices";

interface Props {
  voice: Voice;
  initialCount: number;
}

const PROVIDER_STYLES: Record<Voice["provider"], string> = {
  cartesia: "bg-emerald-50 border-emerald-200 text-emerald-900",
  elevenlabs: "bg-indigo-50 border-indigo-200 text-indigo-900",
};

const PROVIDER_LABEL: Record<Voice["provider"], string> = {
  cartesia: "Cartesia",
  elevenlabs: "ElevenLabs",
};

export function VoiceCard({ voice, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [voting, setVoting] = useState(false);
  const { play, loading, error } = useAudio();

  async function handleVote() {
    if (voting) return;
    setVoting(true);
    setCount((c) => c + 1);
    try {
      const resp = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: voice.id }),
      });
      if (!resp.ok) throw new Error("vote failed");
      const data = (await resp.json()) as { count: number };
      setCount(data.count);
    } catch {
      setCount((c) => Math.max(0, c - 1));
    } finally {
      setVoting(false);
    }
  }

  return (
    <div
      className={`rounded-lg border p-3 flex items-center justify-between gap-3 ${PROVIDER_STYLES[voice.provider]}`}
    >
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider opacity-70">
          {PROVIDER_LABEL[voice.provider]} · {voice.variant}
        </span>
        <span className="text-sm font-mono opacity-60 truncate max-w-[18rem]">
          {voice.providerVoiceId}
        </span>
        {error && (
          <span className="text-xs text-red-600 mt-1">{error}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => play(voice.id, SAMPLE_TEXT)}
          disabled={loading}
          className="rounded-md bg-white border border-current/20 px-3 py-1.5 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
          aria-label="Play sample"
        >
          {loading ? "…" : "▶ Play"}
        </button>
        <button
          type="button"
          onClick={handleVote}
          disabled={voting}
          className="rounded-md bg-white border border-current/20 px-3 py-1.5 text-sm font-medium hover:bg-black/5 disabled:opacity-50 min-w-[4.5rem]"
          aria-label="Upvote"
        >
          ▲ {count}
        </button>
      </div>
    </div>
  );
}
