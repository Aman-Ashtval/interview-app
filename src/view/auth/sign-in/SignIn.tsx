"use client";


import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SignInMessage } from "@/types/auth/sign-in";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./sign-in.module.scss";
import { cn } from "@/utils";

const GOOGLE_ICON_PATH = (
  <>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </>
);

const ENVELOPE_ICON_PATH =
  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";

export function SignIn() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<SignInMessage>(
    errorParam === "auth" ? { type: "error", text: "Authentication failed. Please try again." } : null
  );
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  const supabase = createClient();
  const showSuccess = message?.type === "success" && sentToEmail;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSentToEmail(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // data: name.trim()
        //   ? { full_name: name.trim(), name: name.trim() }
        //   : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setSentToEmail(email);
    setMessage({
      type: "success",
      text: "Check your email for the sign-in link.",
    });
  }

  const handleGoogleSignIn = async () => {
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

  const handleBackToSignIn = () => {
    setMessage(null);
    setSentToEmail(null);
  }

  return (
    <div className={styles["signin__parent-con"]}>
      <div className={styles["signin__main-con"]}>
        <section className={styles["signin__left-con"]} aria-label="About AI Mock Interview">
          <Image
            src="/images/Login.png"
            alt="AI Mock Interview"
            width={500}
            height={500}
          />
        </section>

        <section className={styles["signin__right-con"]} aria-label="Sign in form">
          {/* <div className={styles["signin__logo-container"]}>
            <Image
              src="/images/logo.svg"
              alt="Prepify"
              width={180}
              height={80}
              priority
              className={styles["signin__logo-icon"]}
            />
          </div> */}

          <div className={styles["signin__card"]}>
            {showSuccess ? (
              <>
                <div className={styles["signin__success-icon-wrap"]}>
                  <svg
                    className={styles["signin__success-icon"]}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={ENVELOPE_ICON_PATH}
                    />
                  </svg>
                </div>
                <h2 className={styles["signin__success-title"]}>Check your email</h2>
                <p className={styles["signin__success-text"]}>
                  We&apos;ve sent a sign-in link to
                </p>
                <p className={styles["signin__success-email"]}>{sentToEmail}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToSignIn}
                  className={styles["signin__back-to-signin-btn"]}
                >
                  Back to sign in
                </Button>
              </>
            ) : (
              <div className={styles["signin__form-card"]}>
                <h2 className={styles["signin__title-text"]}>Welcome to Prepify</h2>
                <p className={styles["signin__subtitle-text"]}>
                  Sign in with your account to continue
                </p>

                <div className={styles["signin__social-row"]}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    isLoading={loading}
                    className={styles["signin__social-btn"]}
                    aria-label="Continue with Google"
                  >
                    <svg className={styles["signin__social-btn-icon"]} viewBox="0 0 24 24" aria-hidden>
                      {GOOGLE_ICON_PATH}
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                <div className={styles["signin__or-divider"]}>
                  <span>OR</span>
                </div>

                <form onSubmit={handleEmailSubmit} className={styles["signin__form"]}>
                  {/* <div className={styles["signin__input-group"]}>
                    <Label htmlFor="signin-name" className={styles["signin__label"]}>
                      Display name
                    </Label>
                    <Input
                      id="signin-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Display name"
                      className={styles["signin__input"]}
                      disabled={loading}
                    />
                  </div> */}
                  <div className={styles["signin__input-group"]}>
                    <Label htmlFor="signin-email" className={styles["signin__label"]}>
                      Email address
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={styles["signin__input"]}
                      disabled={loading}
                    />
                  </div>
                  {message && message.type === "error" && (
                    <div
                      className={cn(styles["signin__message"], styles["signin__message--error"])}
                      role="alert"
                    >
                      {message.text}
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    isLoading={loading}
                    className={styles["signin__primary-btn"]}
                  >
                    {!loading && (
                      <svg
                        className={cn(styles["signin__primary-btn-icon"], "size-4")}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={ENVELOPE_ICON_PATH}
                        />
                      </svg>
                    )}
                    {loading ? "Sending…" : "Send sign-in link"}
                  </Button>
                </form>

                <p className={styles["signin__legal"]}>
                  We&apos;ll send a one-time link to your email to sign in.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
