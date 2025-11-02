"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface NotesSectionProps {
  notes?: string | null;
  className?: string;
}

export function NotesSection({ notes, className }: NotesSectionProps) {
  const [copied, setCopied] = useState(false);
  const hasNotes = !!notes && notes.trim().length > 0;

  async function handleCopy() {
    if (!hasNotes) return;
    try {
      await navigator.clipboard.writeText(notes!);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op; clipboard blocked
    }
  }

  return (
    <section
      id="notes"
      className={cn(
        "container w-full px-4 md:px-6 lg:pt-0 pt-0! lg:px-10",
        className
      )}
      aria-labelledby="notes-heading"
    >
      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-2xl border border-slate-200",
          "bg-white/90 drop-shadow-sm backdrop-blur"
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 md:px-6 md:py-4">
          <h2
            id="notes-heading"
            className={cn(
              "bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600",
              "bg-clip-text text-2xl font-bold leading-none text-transparent md:text-3xl"
            )}
          >
            Notes
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasNotes}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                hasNotes
                  ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                  : "border-slate-200 text-slate-400 cursor-not-allowed"
              )}
              aria-label="Copy notes to clipboard"
            >
              {/* Copy icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="relative px-4 py-4 md:px-6 md:py-6">
          {hasNotes ? (
            <article
              className={cn(
                // Typography tuned for plain text and lightweight Markdown-ish content
                "prose prose-slate max-w-none",
                "prose-p:my-2 prose-p:leading-relaxed",
                "prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-200",
                "prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5",
                "prose-li:my-1",
                "text-[15px]"
              )}
            >
              {/* Render as pre-wrapped text to preserve author formatting */}
              <div className="whitespace-pre-wrap break-words">{notes}</div>
            </article>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
              No notes yet. Add logistics, stage cues, or venue-specific caveats
              here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
