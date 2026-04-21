"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SAMPLE_TEXT } from "@/lib/voices";

interface PhraseContextValue {
  phrase: string;
  setPhrase: (value: string) => void;
  defaultPhrase: string;
}

const PhraseContext = createContext<PhraseContextValue | null>(null);

export function PhraseProvider({ children }: { children: ReactNode }) {
  const [phrase, setPhrase] = useState(SAMPLE_TEXT);
  return (
    <PhraseContext.Provider
      value={{ phrase, setPhrase, defaultPhrase: SAMPLE_TEXT }}
    >
      {children}
    </PhraseContext.Provider>
  );
}

export function usePhrase(): PhraseContextValue {
  const ctx = useContext(PhraseContext);
  if (!ctx) throw new Error("usePhrase must be used within PhraseProvider");
  return ctx;
}
