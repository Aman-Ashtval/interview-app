"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import styles from "./dashboard.module.scss";
import { Button } from "@/components/ui/button/button";
import { StartInterviewDialog } from "@/view/main/components/start-interview-dialog/StartInterviewDialog";

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["welcome-container"]}>
        <div className={styles["text-container"]}>
          <h1 className={styles["title"]}>
            Welcome to AI powered mock interviews. Let&apos;s get started
          </h1>
          <p className={styles["description"]}>
            We&apos;re excited to have you on board. Let&apos;s get started with
            your first interview.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={() => setIsOpen(true)}
          >
            Start Interview
          </Button>
        </div>
        <div className={styles["image-container"]}>
          <Image
            src="/images/robot-with-clipboard.jpg"
            alt="Welcome"
            width={100}
            height={200}
            className={styles["robot-image"]}
          />
        </div>
      </div>
      <StartInterviewDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}