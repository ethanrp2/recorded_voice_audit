"use client";

import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { SAMPLE_TEXT, type Voice } from "@/lib/voices";

interface Props {
  voice: Voice;
  initialCount: number;
}

const ACCENT: Record<Voice["provider"], string> = {
  cartesia:
    "bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_0_0_1px_rgba(34,211,238,0.05)_inset]",
  elevenlabs:
    "bg-violet-500/5 border-violet-500/20 hover:border-violet-400/40 shadow-[0_0_0_1px_rgba(167,139,250,0.05)_inset]",
};

const BTN_ACCENT: Record<Voice["provider"], string> = {
  cartesia:
    "text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10 active:bg-cyan-400/20",
  elevenlabs:
    "text-violet-300 hover:text-violet-200 hover:bg-violet-400/10 active:bg-violet-400/20",
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
      className={`flex items-center justify-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${ACCENT[voice.provider]}`}
    >
      <button
        type="button"
        onClick={() => play(voice.id, SAMPLE_TEXT)}
        disabled={loading}
        aria-label="Play sample"
        title={error ?? "Play sample"}
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] disabled:opacity-50 ${BTN_ACCENT[voice.provider]}`}
      >
        {loading ? (
          <span className="block h-3 w-3 animate-pulse rounded-full bg-current" />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M8 5.14v13.72L19 12 8 5.14Z" />
          </svg>
        )}
      </button>
      <button
        type="button"
        onClick={handleVote}
        disabled={voting}
        aria-label="Upvote"
        className={`inline-flex h-8 min-w-[3.5rem] items-center justify-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 text-xs font-semibold tabular-nums disabled:opacity-60 ${BTN_ACCENT[voice.provider]}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M12 4l8 10H4l8-10Z" />
        </svg>
        {count}
      </button>
    </div>
  );
}
