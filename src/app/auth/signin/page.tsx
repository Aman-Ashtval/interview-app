"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SignIn } from "@/view/auth/sign-in/SignIn";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    errorParam === "auth" ? { type: "error", text: "Authentication failed. Please try again." } : null
  );

  const supabase = createClient();

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({
      type: "success",
      text: "Check your email for the sign-in link.",
    });
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  return (
    <main className="min-h-screen">
      <SignIn
        email={email}
        setEmail={setEmail}
        loading={loading}
        message={message}
        onEmailSubmit={signInWithEmail}
        onGoogleSignIn={signInWithGoogle}
        leftImageSrc={null}
        leftImageAlt="AI Mock Interview"
      />
    </main>
  );
}
