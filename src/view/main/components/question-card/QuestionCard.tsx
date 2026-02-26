"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Question } from "@/types/interview";
import { BookOpen, ChevronDown, ChevronUp, MessageSquare, Sparkles, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./question-card.module.scss";

function RatingStars({ value }: { value: number }) {
  const full = Math.min(5, Math.floor(value));
  return (
    <span className={styles.stars} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(styles.star, i <= full && styles.starFilled)}
          size={18}
          aria-hidden
        />
      ))}
    </span>
  );
}

export interface QuestionCardProps {
  question: Question;
  index: number;
  isExpanded: boolean;
  onExpandToggleAction: () => void;
}

export function QuestionCard({ question, index, isExpanded, onExpandToggleAction }: QuestionCardProps) {
  const rating = Number(question.rating) || 0;

  return (
    <Card className={styles.root}>
      <CardHeader className={styles.header} onClick={onExpandToggleAction}>
        <div className={styles.headerInner}>
          <span className={styles.badge}>Q{index + 1}</span>
          <p className={styles.preview}>{question.question}</p>
          <div className={styles.rating}>
            <RatingStars value={rating} />
          </div>
          {isExpanded ? (
            <ChevronUp className={styles.chevron} size={22} aria-hidden />
          ) : (
            <ChevronDown className={styles.chevron} size={22} aria-hidden />
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Sparkles size={16} aria-hidden />
              Question
            </h4>
            <p className={styles.text}>{question.question}</p>
          </div>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <BookOpen size={16} aria-hidden />
              Ideal answer
            </h4>
            <p className={styles.text}>{question.answer}</p>
          </div>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <User size={16} aria-hidden />
              Your answer
            </h4>
            <p className={styles.text}>{question.user_answer || "—"}</p>
          </div>
          {question.feedback && (
            <div className={styles.feedbackBlock}>
              <h4 className={styles.feedbackTitle}>
                <MessageSquare size={16} aria-hidden />
                Feedback
              </h4>
              <p className={styles.feedbackText}>{question.feedback}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
