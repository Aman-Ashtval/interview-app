/**
 * Interview types and shapes for the app.
 * Use these when you add Supabase tables (e.g. interviews, feedback) or API routes.
 */

export const VALID_INTERVIEW_TYPES = ["technical", "behavioral"] as const;
export type InterviewType = (typeof VALID_INTERVIEW_TYPES)[number];

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  technical: "Technical Interview",
  behavioral: "Behavioral Interview",
};

export function isInterviewType(value: string): value is InterviewType {
  return VALID_INTERVIEW_TYPES.includes(value as InterviewType);
}

export type InterviewSession = {
  id: string;
  user_id: string;
  type: InterviewType;
  question: string;
  answer: string | null;
  feedback: string | null;
  created_at: string;
};

export type FeedbackPayload = {
  question: string;
  answer: string;
  type: InterviewType;
};
