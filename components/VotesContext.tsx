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

const USER_VOTES_KEY = "rva:userVotes";

type UserVotes = Record<string, string>;

interface VotesContextValue {
  votes: Record<string, number>;
  userVotes: UserVotes;
  vote: (voice: Voice) => Promise<void>;
  isVotedByUser: (voice: Voice) => boolean;
}

const VotesContext = createContext<VotesContextValue | null>(null);

function loadUserVotes(): UserVotes {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USER_VOTES_KEY);
    return raw ? (JSON.parse(raw) as UserVotes) : {};
  } catch {
    return {};
  }
}

function saveUserVotes(value: UserVotes) {
  try {
    window.localStorage.setItem(USER_VOTES_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

async function postVote(voiceId: string, delta: 1 | -1): Promise<number | null> {
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
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  useEffect(() => {
    setUserVotes(loadUserVotes());
  }, []);

  const vote = useCallback(
    async (voice: Voice) => {
      const prevVoiceId = userVotes[voice.person];
      const unvoting = prevVoiceId === voice.id;

      const nextUserVotes: UserVotes = { ...userVotes };
      if (unvoting) {
        delete nextUserVotes[voice.person];
      } else {
        nextUserVotes[voice.person] = voice.id;
      }
      setUserVotes(nextUserVotes);
      saveUserVotes(nextUserVotes);

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

      const decremented = prevVoiceId
        ? await postVote(prevVoiceId, -1)
        : null;
      const incremented = unvoting ? null : await postVote(voice.id, 1);

      setVotes((curr) => {
        const next = { ...curr };
        if (prevVoiceId && decremented != null) next[prevVoiceId] = decremented;
        if (!unvoting && incremented != null) next[voice.id] = incremented;
        return next;
      });
    },
    [userVotes]
  );

  const isVotedByUser = useCallback(
    (voice: Voice) => userVotes[voice.person] === voice.id,
    [userVotes]
  );

  return (
    <VotesContext.Provider value={{ votes, userVotes, vote, isVotedByUser }}>
      {children}
    </VotesContext.Provider>
  );
}

export function useVotes(): VotesContextValue {
  const ctx = useContext(VotesContext);
  if (!ctx) throw new Error("useVotes must be used within VotesProvider");
  return ctx;
}
