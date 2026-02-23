/**
 * Central re-exports for app types.
 * Prefer: import { SomeType } from "@/types"
 */

export type { SignInMessage, SignInMessageType } from "./auth/sign-in";

export type {
  InterviewType,
  InterviewSession,
  FeedbackPayload,
} from "./interview";
export {
  VALID_INTERVIEW_TYPES,
  INTERVIEW_TYPE_LABELS,
  isInterviewType,
} from "./interview";
