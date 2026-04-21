"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { usePhrase } from "./PhraseContext";
import type { Voice } from "@/lib/voices";

interface Props {
  voice: Voice;
  initialCount: number;
  highlighted: boolean;
}

const VOTED_STORAGE_KEY = "rva:voted";

const PALETTE: Record<
  Voice["provider"],
  {
    ring: string;
    bgTint: string;
    activeBg: string;
    activeHover: string;
    voteHoverText: string;
    voteHoverBorder: string;
  }
> = {
  cartesia: {
    ring: "ring-[#cc785c]/50",
    bgTint: "bg-[#cc785c]/10",
    activeBg: "bg-[#cc785c]",
    activeHover: "hover:bg-[#d88a6e]",
    voteHoverText: "hover:text-[#e7a48a]",
    voteHoverBorder: "hover:border-[#cc785c]/40",
  },
  elevenlabs: {
    ring: "ring-[#6aadc4]/50",
    bgTint: "bg-[#6aadc4]/10",
    activeBg: "bg-[#6aadc4]",
    activeHover: "hover:bg-[#7cbfd4]",
    voteHoverText: "hover:text-[#a3d1de]",
    voteHoverBorder: "hover:border-[#6aadc4]/40",
  },
};

function loadVoted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(VOTED_STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveVoted(set: Set<string>) {
  try {
    window.localStorage.setItem(VOTED_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function VoiceCard({ voice, initialCount, highlighted }: Props) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { play, loading, error } = useAudio();
  const { phrase } = usePhrase();
  const p = PALETTE[voice.provider];

  useEffect(() => {
    setVoted(loadVoted().has(voice.id));
  }, [voice.id]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  async function handleVote() {
    if (busy) return;
    const nextVoted = !voted;
    const delta = nextVoted ? 1 : -1;
    setBusy(true);
    setVoted(nextVoted);
    setCount((c) => Math.max(0, c + delta));

    const stored = loadVoted();
    if (nextVoted) stored.add(voice.id);
    else stored.delete(voice.id);
    saveVoted(stored);

    try {
      const resp = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: voice.id, delta }),
      });
      if (!resp.ok) throw new Error("vote failed");
      const data = (await resp.json()) as { count: number };
      setCount(data.count);
    } catch {
      setVoted(!nextVoted);
      setCount((c) => Math.max(0, c - delta));
      const rollback = loadVoted();
      if (nextVoted) rollback.delete(voice.id);
      else rollback.add(voice.id);
      saveVoted(rollback);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 transition-colors ${
        highlighted ? `${p.bgTint} ring-1 ring-inset ${p.ring}` : ""
      }`}
    >
      <button
        type="button"
        onClick={() => play(voice.id, phrase)}
        disabled={loading}
        aria-label="Play sample"
        title={error ?? "Play sample"}
        className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-medium text-slate-100 transition-colors ${p.voteHoverBorder} hover:bg-white/10 disabled:opacity-50`}
      >
        {loading ? (
          <span className="block h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M8 5.14v13.72L19 12 8 5.14Z" />
          </svg>
        )}
        <span>Play</span>
      </button>
      <button
        type="button"
        onClick={handleVote}
        disabled={busy}
        aria-label={voted ? "Remove upvote" : "Upvote"}
        aria-pressed={voted}
        title={voted ? "Click to remove your upvote" : "Upvote this voice"}
        className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold tabular-nums transition-colors disabled:opacity-60 ${
          voted
            ? `border-transparent ${p.activeBg} text-white ${p.activeHover}`
            : `border-white/10 bg-transparent text-slate-300 ${p.voteHoverBorder} hover:bg-white/5 ${p.voteHoverText}`
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M12 4l8 10H4l8-10Z" />
        </svg>
        <span>{voted ? "Voted" : "Vote"}</span>
        <span className="opacity-70">· {count}</span>
      </button>
    </div>
  );
}
