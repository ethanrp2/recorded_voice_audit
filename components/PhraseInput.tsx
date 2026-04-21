"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { usePhrase } from "./PhraseContext";

export function PhraseInput() {
  const { phrase, setPhrase, defaultPhrase } = usePhrase();
  const [draft, setDraft] = useState(phrase);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  function commit() {
    const next = draft.trim() || defaultPhrase;
    setDraft(next);
    setPhrase(next);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
  }

  function reset() {
    setDraft(defaultPhrase);
    setPhrase(defaultPhrase);
  }

  const dirty = draft !== phrase;
  const isCustom = phrase !== defaultPhrase;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-[#1a1917] p-1.5 shadow-[0_0_40px_rgba(204,120,92,0.08)] focus-within:border-[#cc785c]/40">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a phrase for every voice to say..."
            rows={1}
            className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
          />
          <button
            type="button"
            onClick={commit}
            disabled={!dirty}
            aria-label="Apply phrase"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#cc785c] text-white transition hover:bg-[#d88a6e] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between px-2 text-[11px] text-slate-500">
        <span>
          {isCustom ? (
            <>
              Playing your custom phrase.{" "}
              <button
                type="button"
                onClick={reset}
                className="text-slate-400 underline underline-offset-2 hover:text-slate-200"
              >
                Reset to default
              </button>
            </>
          ) : (
            <>Enter to apply · Shift+Enter for newline</>
          )}
        </span>
        <span className="tabular-nums">{draft.length} chars</span>
      </div>
    </div>
  );
}
