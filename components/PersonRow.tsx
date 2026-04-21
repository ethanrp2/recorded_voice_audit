"use client";

import { VoiceCard } from "./VoiceCard";
import { useVotes } from "./VotesContext";
import type { Voice } from "@/lib/voices";

interface Props {
  person: string;
  voices: Voice[];
}

function pick(
  voices: Voice[],
  provider: Voice["provider"],
  variant: Voice["variant"]
): Voice | undefined {
  return voices.find((v) => v.provider === provider && v.variant === variant);
}

export function PersonRow({ person, voices }: Props) {
  const { userPicks, hasPickFor } = useVotes();
  const chosenId = userPicks[person];
  const anyPick = hasPickFor(person);
  const isHighlighted = (v: Voice | undefined): boolean => {
    if (!v) return false;
    if (!anyPick) return true;
    return v.id === chosenId;
  };

  return (
    <section className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
      <h2 className="mb-2 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[#e7dfd3]">
        {person}
      </h2>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-1 items-center">
        <div />
        <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-[#cc785c]/85">
          Cartesia
        </div>
        <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6aadc4]/85">
          ElevenLabs
        </div>

        <div className="pr-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Regular
        </div>
        {(["cartesia", "elevenlabs"] as const).map((provider) => {
          const v = pick(voices, provider, "regular");
          return v ? (
            <VoiceCard
              key={v.id}
              voice={v}
              highlighted={isHighlighted(v)}
            />
          ) : (
            <div key={`${provider}-regular-missing`} />
          );
        })}

        <div className="pr-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          CX
        </div>
        {(["cartesia", "elevenlabs"] as const).map((provider) => {
          const v = pick(voices, provider, "cx");
          return v ? (
            <VoiceCard
              key={v.id}
              voice={v}
              highlighted={isHighlighted(v)}
            />
          ) : (
            <div key={`${provider}-cx-missing`} />
          );
        })}
      </div>
    </section>
  );
}
