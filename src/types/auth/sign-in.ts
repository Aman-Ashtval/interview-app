/**
 * Auth / sign-in related types.
 */

export type SignInMessageType = "error" | "success";

export type SignInMessage = {
  type: SignInMessageType;
  text: string;
} | null;
