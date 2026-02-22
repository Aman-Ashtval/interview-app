/**
 * Interview types and shapes for the app.
 * Use these when you add Supabase tables (e.g. interviews, feedback) or API routes.
 */

export type InterviewType = "technical" | "behavioral";

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
