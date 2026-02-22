"use client";

import { useState } from "react";
import { cn } from "@/utils";

const SAMPLE_QUESTIONS: Record<"technical" | "behavioral", string> = {
  technical:
    "Tell me about a challenging technical problem you solved recently. What was your approach and what did you learn?",
  behavioral:
    "Tell me about a time you had a conflict with a teammate. How did you handle it and what was the outcome?",
};

type Props = { type: "technical" | "behavioral" };

export function InterviewSession({ type }: Props) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const question = SAMPLE_QUESTIONS[type];

  async function handleGetFeedback() {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      // Placeholder: replace with your API route that calls OpenAI
      await new Promise((r) => setTimeout(r, 800));
      setFeedback(
        "AI feedback will appear here. Add an API route that sends the question + answer to OpenAI and returns structured feedback (e.g. clarity, structure, suggestions)."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 min-w-0 space-y-4 sm:mt-6 sm:space-y-6">
      <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Question
        </p>
        <p className="mt-2 text-slate-900 dark:text-white">{question}</p>
      </div>

      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Your answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={5}
          className="mt-2 min-h-[120px] w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 sm:min-h-[140px] sm:rows-6"
        />
      </div>

      <button
        type="button"
        onClick={handleGetFeedback}
        disabled={loading || !answer.trim()}
        className={cn(
          "rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        )}
      >
        {loading ? "Getting feedback…" : "Get AI feedback"}
      </button>

      {feedback && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Feedback
          </p>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}
