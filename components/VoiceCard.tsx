"use client";

import { useAudio } from "@/hooks/useAudio";
import { usePhrase } from "./PhraseContext";
import { useVotes } from "./VotesContext";
import type { Voice } from "@/lib/voices";

interface Props {
  voice: Voice;
  highlighted: boolean;
}

const PALETTE: Record<
  Voice["provider"],
  {
    ring: string;
    bgTint: string;
    activeBg: string;
    activeHover: string;
    voteHoverText: string;
    voteHoverBorder: string;
    playingBorder: string;
    playingBg: string;
    playingText: string;
    playingRing: string;
  }
> = {
  cartesia: {
    ring: "ring-[#cc785c]/50",
    bgTint: "bg-[#cc785c]/10",
    activeBg: "bg-[#cc785c]",
    activeHover: "hover:bg-[#d88a6e]",
    voteHoverText: "hover:text-[#e7a48a]",
    voteHoverBorder: "hover:border-[#cc785c]/40",
    playingBorder: "border-[#cc785c]",
    playingBg: "bg-[#cc785c]/30",
    playingText: "text-[#f5d9c9]",
    playingRing: "ring-[#cc785c]/50",
  },
  elevenlabs: {
    ring: "ring-[#6aadc4]/50",
    bgTint: "bg-[#6aadc4]/10",
    activeBg: "bg-[#6aadc4]",
    activeHover: "hover:bg-[#7cbfd4]",
    voteHoverText: "hover:text-[#a3d1de]",
    voteHoverBorder: "hover:border-[#6aadc4]/40",
    playingBorder: "border-[#6aadc4]",
    playingBg: "bg-[#6aadc4]/30",
    playingText: "text-[#c4e3ed]",
    playingRing: "ring-[#6aadc4]/50",
  },
};

export function VoiceCard({ voice, highlighted }: Props) {
  const { play, loadingVoiceId, playingVoiceId, error } = useAudio();
  const { phrase } = usePhrase();
  const { vote, isChosen, countFor } = useVotes();
  const p = PALETTE[voice.provider];
  const voted = isChosen(voice);
  const count = countFor(voice);
  const isLoading = loadingVoiceId === voice.id;
  const isPlaying = playingVoiceId === voice.id;

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 transition-colors ${
        highlighted ? `${p.bgTint} ring-1 ring-inset ${p.ring}` : ""
      }`}
    >
      <button
        type="button"
        onClick={() => play(voice.id, phrase)}
        disabled={isLoading}
        aria-label="Play sample"
        title={error ?? "Play sample"}
        className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors disabled:opacity-50 ${
          isPlaying
            ? `${p.playingBorder} ${p.playingBg} ${p.playingText} ring-2 ring-offset-0 ${p.playingRing}`
            : `border-white/10 bg-white/[0.06] text-slate-100 ${p.voteHoverBorder} hover:bg-white/10`
        }`}
      >
        {isPlaying ? (
          <PlayingIndicator />
        ) : isLoading ? (
          <span className="block h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M8 5.14v13.72L19 12 8 5.14Z" />
          </svg>
        )}
        <span>{isPlaying ? "Playing" : "Play"}</span>
      </button>
      <button
        type="button"
        onClick={() => vote(voice)}
        aria-label={voted ? "Remove vote" : "Vote for this voice"}
        aria-pressed={voted}
        title={voted ? "Click to remove this vote" : "Vote for this voice"}
        className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors ${
          voted
            ? `border-transparent ${p.activeBg} text-white ${p.activeHover}`
            : `border-white/10 bg-transparent text-slate-300 ${p.voteHoverBorder} hover:bg-white/5 ${p.voteHoverText}`
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M12 4l8 10H4l8-10Z" />
        </svg>
        <span>{voted ? "Voted" : "Vote"}</span>
        <span className="tabular-nums opacity-70">· {count}</span>
      </button>
    </div>
  );
}

function PlayingIndicator() {
  return (
    <span
      aria-hidden
      className="inline-flex h-3.5 w-3.5 items-end justify-between gap-[1.5px]"
    >
      <span className="block w-[2px] rounded-sm bg-current animate-[eq_900ms_ease-in-out_infinite] [--h:60%]" />
      <span className="block w-[2px] rounded-sm bg-current animate-[eq_700ms_ease-in-out_infinite_-200ms] [--h:90%]" />
      <span className="block w-[2px] rounded-sm bg-current animate-[eq_800ms_ease-in-out_infinite_-400ms] [--h:45%]" />
    </span>
  );
}
