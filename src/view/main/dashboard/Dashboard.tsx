"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.scss";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StartInterviewDialog } from "@/view/main/components/start-interview-dialog/StartInterviewDialog";
import { MockInterviewDetails } from "@/types/interview";
import { toast } from "sonner";
import { Search, RotateCcw, MessageSquare, Loader2, Star } from "lucide-react";

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<MockInterviewDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingsByMockId, setRatingsByMockId] = useState<Record<string, number>>({});
  const router = useRouter();
  const supabase = createClient();

  const filteredInterviews = useMemo(() => {
    if (!searchQuery.trim()) return interviews;
    const q = searchQuery.trim().toLowerCase();
    return interviews.filter(
      (i) =>
        i.job_title?.toLowerCase().includes(q) ||
        i.job_description?.toLowerCase().includes(q) ||
        i.level?.toLowerCase().includes(q)
    );
  }, [interviews, searchQuery]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("mock_interview")
          .select("*")
          .eq("created_by", user?.email ?? "");
        setInterviews((data as MockInterviewDetails[]) ?? []);
      } catch (error) {
        toast.error("Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  useEffect(() => {
    if (interviews.length === 0) return;
    const fetchRatings = async () => {
      const results = await Promise.all(
        interviews.map(async (i) => {
          const { data } = await supabase.rpc("get_overall_rating", {
            p_mock_id: i.mock_id,
          });
          const rating =
            data && typeof data === "object" && "overall_rating" in data
              ? Number((data as { overall_rating?: number }).overall_rating)
              : null;
          return { mock_id: i.mock_id, rating };
        })
      );
      setRatingsByMockId(
        results.reduce<Record<string, number>>((acc, { mock_id, rating }) => {
          if (rating != null && !Number.isNaN(rating)) acc[mock_id] = rating;
          return acc;
        }, {})
      );
    };
    fetchRatings();
  }, [interviews]);

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
      <div className={styles["interview-container"]}>
        <div className={styles["interview-container__header"]}>
          <h2 className={styles["interview-container__title"]}>Your interviews</h2>
          <div className={styles["interview-container__search-wrap"]}>
            <Search className={styles["interview-container__search-icon"]} size={20} aria-hidden />
            <Input
              type="search"
              placeholder="Search by role or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles["interview-container__search-input"]}
              aria-label="Search interviews"
            />
          </div>
        </div>
        {loading ? (
          <div className={styles["interview-container__loader"]}>
            <Loader2 className="animate-spin text-violet-500" size={32} />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <p className={styles["interview-container__empty"]}>
            {interviews.length === 0
              ? "No interviews yet. Start your first one above."
              : "No interviews match your search."}
          </p>
        ) : (
          <div className={styles["interview-container__grid"]}>
            {filteredInterviews.map((interview) => {
              const rating = ratingsByMockId[interview.mock_id];
              return (
              <Card key={interview.mock_id} className={styles["interview-card"]}>
                {rating != null && (
                  <div className={styles["interview-card__rating"]}>
                    <Star size={14} aria-hidden />
                    <span>{Number(rating).toFixed(1)}</span>
                  </div>
                )}
                <CardHeader className={styles["interview-card__header"]}>
                  <CardTitle className={styles["interview-card__title"]}>
                    {interview.job_title || "Untitled interview"}
                  </CardTitle>
                  <p className={styles["interview-card__meta"]}>
                    Level: {interview.level} · {interview.experience} yrs exp
                  </p>
                </CardHeader>
                <CardContent className={styles["interview-card__content"]}>
                  <p className={styles["interview-card__description"]}>
                    {interview.job_description
                      ? interview.job_description.length > 120
                        ? `${interview.job_description.slice(0, 120)}...`
                        : interview.job_description
                      : "—"}
                  </p>
                </CardContent>
                <CardFooter className={styles["interview-card__footer"]}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/start-interview/${interview.mock_id}`)}
                  >
                    <RotateCcw size={16} />
                    Retake
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/start-interview/${interview.mock_id}/feedback`)}
                  >
                    <MessageSquare size={16} />
                    Check feedback
                  </Button>
                </CardFooter>
              </Card>
            );
            })}
          </div>
        )}
      </div>
      <StartInterviewDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}