import { PersonRow } from "@/components/PersonRow";
import { PhraseInput } from "@/components/PhraseInput";
import { PhraseProvider } from "@/components/PhraseContext";
import { SummaryCharts } from "@/components/SummaryCharts";
import { WelcomeToast } from "@/components/WelcomeToast";
import { getAllVotes } from "@/lib/db";
import { PEOPLE, VOICES } from "@/lib/voices";

export const dynamic = "force-dynamic";

export default async function Home() {
  const votes = await getAllVotes();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#141311] text-slate-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(50% 30% at 20% 0%, rgba(204,120,92,0.12) 0%, transparent 60%)," +
            "radial-gradient(40% 30% at 85% 5%, rgba(212,163,115,0.08) 0%, transparent 60%)",
        }}
      />

      <PhraseProvider>
        <WelcomeToast />

        <div className="mx-auto max-w-6xl px-6 py-10 space-y-7">
          <header className="flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-500">
                Voice · Audit · 2026
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#f5f1ea]">
                Recorded Voice Audit
              </h1>
              <p className="max-w-2xl text-sm text-slate-400">
                Play each synthesized voice and upvote the one that sounds the
                most like the real person.
              </p>
            </div>
            <div className="hidden sm:flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#cc785c]" />
                <span className="text-slate-400">Cartesia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#6aadc4]" />
                <span className="text-slate-400">ElevenLabs</span>
              </div>
            </div>
          </header>

          <SummaryCharts voices={VOICES} votes={votes} />

          <PhraseInput />

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
      </PhraseProvider>
    </div>
  );
}
