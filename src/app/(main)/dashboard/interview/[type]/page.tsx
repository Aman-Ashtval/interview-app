import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InterviewSession } from "@/components/interview-session";

const VALID_TYPES = ["technical", "behavioral"] as const;
type InterviewType = (typeof VALID_TYPES)[number];

function isValidType(type: string): type is InterviewType {
  return VALID_TYPES.includes(type as InterviewType);
}

const LABELS: Record<InterviewType, string> = {
  technical: "Technical Interview",
  behavioral: "Behavioral Interview",
};

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isValidType(type)) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl min-w-0 px-3 py-4 sm:px-4 sm:py-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Back to dashboard
      </Link>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {LABELS[type]}
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
        Answer the question below. You can type your response or record yourself (recording can be added next).
      </p>
      <InterviewSession type={type} />
    </div>
  );
}
