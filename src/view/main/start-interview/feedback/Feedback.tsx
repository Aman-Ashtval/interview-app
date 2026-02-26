"use client";

import React, { useEffect, useState, useMemo } from "react";
import styles from "./feedback.module.scss";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ChevronDown, MessageSquare, Search, Star, Trophy } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuestionCard } from "@/view/main/components/question-card/QuestionCard";
import { Question } from "@/types/interview";
import { cn } from "@/lib/utils";
import { PDFGenerator } from "@/components/pdf/pdf-generator/PDFGenerator";
import { InterviewPdfDoc } from "@/components/pdf/documents/interview-pdf-doc/InterviewPdfDoc";

const RATING_OPTIONS = [
  { value: "all", label: "All" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
  { value: "2", label: "2+ Stars" },
  { value: "1", label: "1+ Stars" },
];

function RatingStars({ value }: { value: number }) {
  const full = Math.min(5, Math.floor(value));
  return (
    <span className={styles["feedback__stars"]} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            styles["feedback__star"],
            i <= full && styles["feedback__star--filled"]
          )}
          size={18}
          aria-hidden
        />
      ))}
    </span>
  );
}

const Feedback = ({ interview_id }: { interview_id: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [interviewTitle, setInterviewTitle] = useState<string>("Interview Feedback");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!interview_id) return;
      try {
        setIsLoading(true);
        const [questionsRes, mockRes] = await Promise.all([
          supabase
            .from("questions_table")
            .select("*")
            .eq("mock_id", interview_id)
            .order("id", { ascending: true }),
          supabase.from("mock_interview").select("job_title").eq("mock_id", interview_id).single(),
        ]);
        if (questionsRes.error) throw questionsRes.error;
        const data = questionsRes.data as Question[];
        setQuestions(data ?? []);
        if (data?.length) {
          setExpandedIds(new Set([data[0].id]));
        }
        if (mockRes.data?.job_title) {
          setInterviewTitle(mockRes.data.job_title as string);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load feedback");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [interview_id]);

  const overallRating = useMemo(() => {
    if (!questions.length) return 0;
    const sum = questions.reduce((a, q) => a + (Number(q.rating) || 0), 0);
    return Math.round((sum / questions.length) * 10) / 10;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let list = questions;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((item) =>
        item.question?.toLowerCase().includes(q)
      );
    }
    const minRating = ratingFilter === "all" ? 0 : parseInt(ratingFilter, 10);
    if (minRating > 0) {
      list = list.filter((item) => (Number(item.rating) || 0) >= minRating);
    }
    return list;
  }, [questions, searchQuery, ratingFilter]);

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredQuestions.map((q) => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  if (isLoading) {
    return (
      <div className={styles["feedback"]}>
        <div className={styles["feedback__loader"]}>
          <Loader />
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className={styles["feedback"]}>
        <div className={styles["feedback__empty"]}>
          <MessageSquare className={styles["feedback__empty-icon"]} size={48} />
          <p>No feedback available for this interview yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["feedback"]}>
      <section className={styles["feedback__hero"]}>
        <div className={styles["feedback__hero-icon"]}>
          <Trophy size={40} aria-hidden />
        </div>
        <h1 className={styles["feedback__hero-title"]}>
          Congratulations!
        </h1>
        <p className={styles["feedback__hero-subtitle"]}>
          You&apos;ve completed the interview. Here&apos;s how you did.
        </p>
        <div className={styles["feedback__overall"]}>
          <span className={styles["feedback__overall-label"]}>Overall</span>
          <RatingStars value={overallRating} />
          <span className={styles["feedback__overall-value"]}>
            {overallRating.toFixed(1)} / 5
          </span>
        </div>
        <div className={styles["feedback__pdf-download"]}>
          <PDFGenerator
            document={
              <InterviewPdfDoc
                questions={questions}
                interviewTitle={interviewTitle}
                overallRating={overallRating}
              />
            }
            title={`Interview-Feedback-${interviewTitle.replace(/\s+/g, "-")}`}
            buttonText="Download feedback PDF"
          />
        </div>
      </section>

      <section className={styles["feedback__filters"]}>
        <div className={styles["feedback__search-wrap"]}>
          <Search className={styles["feedback__search-icon"]} size={20} aria-hidden />
          <Input
            type="search"
            placeholder="Search by question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles["feedback__search-input"]}
            aria-label="Search questions"
          />
        </div>
        <div className={styles["feedback__rating-filter"]}>
          <span className={styles["feedback__filter-label"]}>Rating</span>
          <DropdownMenu
          
          >
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className={styles["feedback__rating-trigger"]}>
                {RATING_OPTIONS.find((o) => o.value === ratingFilter)?.label ?? "All"}
                <ChevronDown size={16} className={styles["feedback__rating-chevron"]} aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles["feedback__rating-dropdown"]}>
              {RATING_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setRatingFilter(opt.value)}
                  className={cn(ratingFilter === opt.value && styles["feedback__rating-option--active"], styles["feedback__rating-option"])}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={styles["feedback__expand-actions"]}>
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Collapse all
          </Button>
        </div>
      </section>

      <p className={styles["feedback__results-count"]}>
        {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
      </p>

      <div className={styles["feedback__list"]}>
        {filteredQuestions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={index}
            isExpanded={expandedIds.has(q.id)}
            onExpandToggleAction={() => toggleExpanded(q.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Feedback;
