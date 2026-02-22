"use client";

import Link from "next/link";
import styles from "./sign-in.module.scss";
import { cn } from "@/utils";

export type SignInMessage = { type: "error" | "success"; text: string } | null;

export type SignInViewProps = {
  email: string;
  setEmail: (value: string) => void;
  loading: boolean;
  message: SignInMessage;
  onEmailSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  /** Optional: image src for the left panel (AI / app hero image) */
  leftImageSrc?: string | null;
  /** Optional: alt text for left panel image */
  leftImageAlt?: string;
};

const GOOGLE_ICON_PATH = (
  <>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </>
);

const LAPTOP_ICON_PATH = "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";

export function SignIn({
  email,
  setEmail,
  loading,
  message,
  onEmailSubmit,
  onGoogleSignIn,
  leftImageSrc,
  leftImageAlt = "AI Mock Interview",
}: SignInViewProps) {
  return (
    <div className={styles["signin__parent-con"]}>
      <div className={styles["signin__main-con"]}>
        <section className={styles["signin__left-con"]} aria-label="About AI Mock Interview">
          <div>
            <div className={styles["signin__logo"]} aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <h1 className={styles["signin__headline-text"]}>
              Practice interviews with AI feedback
            </h1>
            <p className={styles["signin__subheadline-text"]}>
              Record your answers and get instant feedback to improve your technical and behavioral skills.
            </p>
            <div className={styles["signin__image-wrapper"]}>
              {leftImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={leftImageSrc} alt={leftImageAlt} />
              ) : (
                <div className={styles["signin__image-placeholder"]}>
                  <svg
                    className={styles["signin__image-placeholder-icon"]}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={LAPTOP_ICON_PATH}
                    />
                  </svg>
                  <span className={styles["signin__image-placeholder-title"]}>
                    AI image for your app
                  </span>
                  <span className={styles["signin__image-placeholder-hint"]}>
                    Add an image via leftImageSrc prop or place your asset here
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles["signin__right-con"]} aria-label="Sign in form">
          <div className={styles["signin__form-card"]}>
            <h2 className={styles["signin__title-text"]}>Sign in</h2>
            <p className={styles["signin__subtitle-text"]}>
              Use your email or Google to continue to AI Mock Interview
            </p>

            <div className={styles["signin__social-row"]}>
              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={loading}
                className={styles["signin__social-btn"]}
                aria-label="Sign in with Google"
              >
                <svg className={styles["signin__social-btn-icon"]} viewBox="0 0 24 24" aria-hidden>
                  {GOOGLE_ICON_PATH}
                </svg>
                Google
              </button>
            </div>

            <div className={styles["signin__or-divider"]}>
              <span>Or</span>
            </div>

            <form onSubmit={onEmailSubmit} className={styles["signin__form"]}>
              <div className={styles["signin__input-group"]}>
                <label htmlFor="signin-email" className={styles["signin__label"]}>
                  Email
                </label>
                <input
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
              {message && (
                <div
                  className={cn(
                    styles["signin__message"],
                    message.type === "error"
                      ? styles["signin__message--error"]
                      : styles["signin__message--success"]
                  )}
                  role="alert"
                >
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={styles["signin__primary-btn"]}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>

            <p className={styles["signin__legal"]}>
              By signing in, you agree to use this app. We’ll send a one-time link to your email.
            </p>

            <Link href="/" className={styles["signin__back-link"]}>
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
