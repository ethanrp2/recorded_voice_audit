import { PersonRow } from "@/components/PersonRow";
import { SummaryCharts } from "@/components/SummaryCharts";
import { getAllVotes } from "@/lib/db";
import { PEOPLE, VOICES } from "@/lib/voices";

export const dynamic = "force-dynamic";

export default function Home() {
  const votes = getAllVotes();

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Recorded voice audit
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Play each voice and upvote the one that sounds the most like the
            real person. Four variants per person — two from Cartesia, two from
            ElevenLabs, each with a standard and a &ldquo;cx&rdquo; recording.
          </p>
        </header>

        <SummaryCharts voices={VOICES} votes={votes} />

        <div className="space-y-5">
          {PEOPLE.map((person) => (
            <PersonRow
              key={person}
              person={person}
              voices={VOICES.filter((v) => v.person === person)}
              votes={votes}
            />
          ))}
        </div>

        <footer className="pt-6 text-center text-xs text-gray-400">
          {VOICES.length} voices across {PEOPLE.length} people
        </footer>
      </div>
    </div>
  );
}
