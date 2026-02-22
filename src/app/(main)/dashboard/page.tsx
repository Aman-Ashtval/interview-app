import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Code2, MessageCircle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto w-full max-w-4xl min-w-0 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Choose an interview type to practice and get AI-powered feedback.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/interview/technical"
          className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:rounded-2xl sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
              <Code2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Technical Interview
            </h2>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Practice coding questions, system design, and problem-solving. Record your answers and get feedback.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:underline">
            Start practice →
          </span>
        </Link>

        <Link
          href="/dashboard/interview/behavioral"
          className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:rounded-2xl sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Behavioral Interview
            </h2>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Practice STAR method, leadership stories, and culture-fit questions with AI feedback.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
            Start practice →
          </span>
        </Link>
      </div>

      <section className="mt-8 min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:mt-10 sm:rounded-2xl sm:p-6">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          How it works
        </h3>
        <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>Choose Technical or Behavioral above.</li>
          <li>Answer questions (you can type or record your response).</li>
          <li>Get AI feedback on clarity, structure, and tips to improve.</li>
        </ol>
      </section>
    </div>
  );
}
