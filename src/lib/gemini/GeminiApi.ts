import { GoogleGenAI } from "@google/genai";

/**
 * Gemini API key. Prefer GEMINI_API_KEY for server-side only (not exposed to client).
 * NEXT_PUBLIC_GEMINI_API_KEY is used when set (e.g. in .env.local).
 */
function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    console.error("Missing Gemini API key. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
    return "";
  }
  return key;
}

let geminiClient: GoogleGenAI | null = null;


export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return geminiClient;
}

export { GoogleGenAI };
