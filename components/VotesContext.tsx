"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Voice } from "@/lib/voices";

const USER_PICKS_KEY = "rva:userPicks";

interface VotesContextValue {
  votes: Record<string, number>;
  userPicks: Record<string, string>;
  vote: (voice: Voice) => Promise<void>;
  isChosen: (voice: Voice) => boolean;
  hasPickFor: (person: string) => boolean;
  countFor: (voice: Voice) => number;
}

const VotesContext = createContext<VotesContextValue | null>(null);

function loadUserPicks(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USER_PICKS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveUserPicks(value: Record<string, string>) {
  try {
    window.localStorage.setItem(USER_PICKS_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

async function postVote(
  voiceId: string,
  delta: 1 | -1
): Promise<number | null> {
  try {
    const resp = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId, delta }),
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

export function VotesProvider({
  initialVotes,
  children,
}: {
  initialVotes: Record<string, number>;
  children: ReactNode;
}) {
  const [votes, setVotes] = useState<Record<string, number>>(initialVotes);
  const [userPicks, setUserPicks] = useState<Record<string, string>>({});

  useEffect(() => {
    setUserPicks(loadUserPicks());
  }, []);

  const vote = useCallback(
    async (voice: Voice) => {
      const prevVoiceId = userPicks[voice.person];
      const unvoting = prevVoiceId === voice.id;

      const nextPicks = { ...userPicks };
      if (unvoting) delete nextPicks[voice.person];
      else nextPicks[voice.person] = voice.id;
      setUserPicks(nextPicks);
      saveUserPicks(nextPicks);

      setVotes((curr) => {
        const next = { ...curr };
        if (prevVoiceId) {
          next[prevVoiceId] = Math.max(0, (next[prevVoiceId] ?? 0) - 1);
        }
        if (!unvoting) {
          next[voice.id] = (next[voice.id] ?? 0) + 1;
        }
        return next;
      });

      const decrementedCount = prevVoiceId
        ? await postVote(prevVoiceId, -1)
        : null;
      const incrementedCount = unvoting ? null : await postVote(voice.id, 1);

      setVotes((curr) => {
        const next = { ...curr };
        if (prevVoiceId && decrementedCount != null) {
          next[prevVoiceId] = decrementedCount;
        }
        if (!unvoting && incrementedCount != null) {
          next[voice.id] = incrementedCount;
        }
        return next;
      });
    },
    [userPicks]
  );

  const isChosen = useCallback(
    (voice: Voice) => userPicks[voice.person] === voice.id,
    [userPicks]
  );

  const hasPickFor = useCallback(
    (person: string) => Boolean(userPicks[person]),
    [userPicks]
  );

  const countFor = useCallback(
    (voice: Voice) => votes[voice.id] ?? 0,
    [votes]
  );

  return (
    <VotesContext.Provider
      value={{ votes, userPicks, vote, isChosen, hasPickFor, countFor }}
    >
      {children}
    </VotesContext.Provider>
  );
}

export function useVotes(): VotesContextValue {
  const ctx = useContext(VotesContext);
  if (!ctx) throw new Error("useVotes must be used within VotesProvider");
  return ctx;
}
