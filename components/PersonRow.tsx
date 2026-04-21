import { VoiceCard } from "./VoiceCard";
import type { Voice } from "@/lib/voices";

interface Props {
  person: string;
  voices: Voice[];
  votes: Record<string, number>;
}

function pick(
  voices: Voice[],
  provider: Voice["provider"],
  variant: Voice["variant"]
): Voice | undefined {
  return voices.find((v) => v.provider === provider && v.variant === variant);
}

export function PersonRow({ person, voices, votes }: Props) {
  const maxCount = voices.reduce(
    (m, v) => Math.max(m, votes[v.id] ?? 0),
    0
  );
  const isHighlighted = (v: Voice | undefined): boolean => {
    if (!v) return false;
    const c = votes[v.id] ?? 0;
    if (maxCount === 0) return true;
    return c === maxCount;
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
              initialCount={votes[v.id] ?? 0}
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
              initialCount={votes[v.id] ?? 0}
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
