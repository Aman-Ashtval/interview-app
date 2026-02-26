"use client";

import Link from "next/link";
import {
  LogIn,
  LayoutDashboard,
  Mic,
  MessageSquare,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import styles from "./how-it-works.module.scss";

const steps = [
  {
    step: 1,
    icon: LogIn,
    title: "Sign in",
    description:
      "Create an account or sign in with your email. We use magic links or OAuth so you can get started quickly.",
    where: "Auth",
  },
  {
    step: 2,
    icon: LayoutDashboard,
    title: "Start an interview",
    description:
      "From your Dashboard, click “Start Interview”. Enter the job role, description, experience level, and we’ll generate tailored questions for you.",
    where: "Dashboard",
    href: "/dashboard",
  },
  {
    step: 3,
    icon: Mic,
    title: "Answer with your voice",
    description:
      "Go through each question one by one. Use the mic to record your answer—speak clearly and take your time. You can re-answer before moving on.",
    where: "Start interview page",
  },
  {
    step: 4,
    icon: MessageSquare,
    title: "Get AI feedback",
    description:
      "After you submit, our AI evaluates your answers and gives you a rating plus written feedback for each question.",
    where: "Feedback page",
  },
  {
    step: 5,
    icon: FileText,
    title: "Review & download",
    description:
      "See all your feedback in one place. Download a PDF of the interview feedback or browse all your questions and answers from the Questions page.",
    where: "Feedback & Questions",
    href: "/questions",
  },
];

export function HowItWorks() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <Sparkles size={32} aria-hidden />
        </div>
        <h1 className={styles.heroTitle}>How Prepify works</h1>
        <p className={styles.heroSubtitle}>
          Practice mock interviews with AI-generated questions, record your answers, and get instant feedback to improve.
        </p>
      </section>

      <section className={styles.steps} aria-label="Steps to use Prepify">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.step} className={styles.stepCard}>
              <div className={styles.stepNumber} aria-hidden>
                {item.step}
              </div>
              <div className={styles.stepIcon}>
                <Icon size={24} aria-hidden />
              </div>
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>{item.title}</h2>
                <p className={styles.stepDescription}>{item.description}</p>
                <p className={styles.stepWhere}>
                  <span className={styles.stepWhereLabel}>Where:</span> {item.where}
                </p>
                {item.href && (
                  <Link href={item.href} className={styles.stepLink}>
                    Go to {item.where}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.cta}>
        <p className={styles.ctaText}>Ready to practice?</p>
        <Button variant="primary" size="lg" asChild>
          <Link href="/dashboard" className="text-white">
            Go to Dashboard
            <ArrowRight size={20} aria-hidden />
          </Link>
        </Button>
      </section>
    </div>
  );
}
