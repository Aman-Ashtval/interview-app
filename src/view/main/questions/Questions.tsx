"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Search } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "@/view/main/components/question-card/QuestionCard";
import { Question } from "@/types/interview";
import { PDFGenerator } from "@/components/pdf/pdf-generator/PDFGenerator";
import { QuestionPdfDoc } from "@/components/pdf/documents/question-pdf-doc/QuestionPdfDoc";
import styles from "./questions.module.scss";

export function Questions() {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.email) {
        setQuestions([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("questions_table")
          .select("*")
          .eq("created_by", user.email)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setQuestions((data as Question[]) ?? []);
        if (data?.length) {
          setExpandedIds(new Set([(data[0] as Question).id]));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load questions");
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [user?.email, supabase]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.trim().toLowerCase();
    return questions.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q) ||
        item.user_answer?.toLowerCase().includes(q) ||
        item.feedback?.toLowerCase().includes(q)
    );
  }, [questions, searchQuery]);

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your questions</h1>
        <div className={styles.headerActions}>
          {questions.length > 0 && (
            <PDFGenerator
              document={<QuestionPdfDoc 
                questions={questions}  
                />}
              title="My-Questions-And-Answers"
              buttonText="Download PDF"
            />
          )}
          <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} size={20} aria-hidden />
          <Input
            type="search"
            placeholder="Search by question, answer or feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search questions"
          />
        </div>
        </div>
      </header>

      {!questions.length ? (
        <div className={styles.empty}>
          <p>No questions yet. Complete an interview to see your questions and feedback here.</p>
        </div>
      ) : !filteredQuestions.length ? (
        <div className={styles.empty}>
          <p>No questions match your search.</p>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
          </p>
          <div className={styles.list}>
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
        </>
      )}
    </div>
  );
}
