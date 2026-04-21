import { PersonRow } from "@/components/PersonRow";
import { SummaryCharts } from "@/components/SummaryCharts";
import { getAllVotes } from "@/lib/db";
import { PEOPLE, VOICES } from "@/lib/voices";

export const dynamic = "force-dynamic";

export default function Home() {
  const votes = getAllVotes();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05060c] text-slate-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(34,211,238,0.14) 0%, transparent 60%)," +
            "radial-gradient(50% 40% at 80% 10%, rgba(167,139,250,0.14) 0%, transparent 60%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-500">
              Voice · Audit · 2026
            </div>
            <h1 className="mt-1 bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Recorded Voice Audit
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Play each synthesized voice and upvote the one that sounds the
              most like the real person. Cartesia vs ElevenLabs, regular vs cx.
            </p>
          </div>
          <div className="hidden md:flex gap-3 font-mono text-[10px] uppercase tracking-widest">
            <Legend color="bg-cyan-400" label="Cartesia" />
            <Legend color="bg-violet-400" label="ElevenLabs" />
          </div>
        </header>

        <SummaryCharts voices={VOICES} votes={votes} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PEOPLE.map((person) => (
            <PersonRow
              key={person}
              person={person}
              voices={VOICES.filter((v) => v.person === person)}
              votes={votes}
            />
          ))}
        </div>

        <footer className="pt-4 pb-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          {VOICES.length} voices · {PEOPLE.length} people
        </footer>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-400">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
