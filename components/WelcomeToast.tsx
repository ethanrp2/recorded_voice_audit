"use client";

import { useEffect, useState } from "react";

export function WelcomeToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => setVisible(false), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 top-5 z-50 flex justify-center px-4 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
      onTransitionEnd={() => {
        if (!visible) setDismissed(true);
      }}
    >
      <div className="flex items-center gap-3 rounded-full border border-[#cc785c]/30 bg-[#1a1917]/95 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#cc785c]/15 text-[#e7a48a]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M12 19V5M5 12l7 7 7-7" />
          </svg>
        </span>
        <span className="text-sm text-slate-200">
          Scroll to your voice and upvote the one you like best.
        </span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="-mr-1 rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-slate-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
