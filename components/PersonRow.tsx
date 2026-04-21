import { VoiceCard } from "./VoiceCard";
import type { Voice } from "@/lib/voices";

interface Props {
  person: string;
  voices: Voice[];
  votes: Record<string, number>;
}

const ORDER: Record<string, number> = {
  "cartesia-regular": 0,
  "cartesia-cx": 1,
  "elevenlabs-regular": 2,
  "elevenlabs-cx": 3,
};

export function PersonRow({ person, voices, votes }: Props) {
  const sorted = [...voices].sort(
    (a, b) =>
      (ORDER[`${a.provider}-${a.variant}`] ?? 99) -
      (ORDER[`${b.provider}-${b.variant}`] ?? 99)
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold capitalize text-gray-900">
        {person}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((v) => (
          <VoiceCard key={v.id} voice={v} initialCount={votes[v.id] ?? 0} />
        ))}
      </div>
    </section>
  );
}
