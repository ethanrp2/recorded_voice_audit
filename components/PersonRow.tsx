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
  const cells: {
    provider: Voice["provider"];
    variant: Voice["variant"];
  }[] = [
    { provider: "cartesia", variant: "regular" },
    { provider: "elevenlabs", variant: "regular" },
    { provider: "cartesia", variant: "cx" },
    { provider: "elevenlabs", variant: "cx" },
  ];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
          {person}
        </h2>
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          4 voices
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 items-center">
        {/* column headers */}
        <div />
        <div className="text-center font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
          Cartesia
        </div>
        <div className="text-center font-mono text-[10px] uppercase tracking-widest text-violet-400/80">
          ElevenLabs
        </div>

        {/* regular row */}
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 pr-2">
          Regular
        </div>
        {(["cartesia", "elevenlabs"] as const).map((provider) => {
          const v = pick(voices, provider, "regular");
          return v ? (
            <VoiceCard key={v.id} voice={v} initialCount={votes[v.id] ?? 0} />
          ) : (
            <div key={`${provider}-regular-missing`} />
          );
        })}

        {/* cx row */}
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 pr-2">
          CX
        </div>
        {(["cartesia", "elevenlabs"] as const).map((provider) => {
          const v = pick(voices, provider, "cx");
          return v ? (
            <VoiceCard key={v.id} voice={v} initialCount={votes[v.id] ?? 0} />
          ) : (
            <div key={`${provider}-cx-missing`} />
          );
        })}
      </div>
    </section>
  );
}
