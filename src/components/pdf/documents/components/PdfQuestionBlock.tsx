import { View, Text } from "@react-pdf/renderer";
import { pdfQuestionBlockStyles as styles } from "./pdf-question-block-styles";
import type { Question } from "@/types/interview";

interface PdfQuestionBlockProps {
  question: Question;
  index: number;
  showRating?: boolean;
  showFeedback?: boolean;
}

export function PdfQuestionBlock({
  question,
  index,
  showRating = true,
  showFeedback = true,
}: PdfQuestionBlockProps) {
  const rating = Number(question.rating) ?? 0;
  const hasFeedback = showFeedback && question.feedback?.trim();

  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.questionBlockHeader}>
        <Text style={styles.cardTitle}>Question {index + 1}</Text>
        {showRating && (
          <Text style={styles.ratingBadge}>★ {rating.toFixed(1)} / 5</Text>
        )}
      </View>
      <Text style={styles.text}>{question.question || "—"}</Text>
      <Text style={styles.label}>Ideal answer</Text>
      <Text style={styles.text}>{question.answer || "—"}</Text>
      <Text style={styles.label}>Your answer</Text>
      <Text style={question.user_answer ? styles.text : styles.textLast}>
        {question.user_answer || "—"}
      </Text>
      {hasFeedback && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackLabel}>Feedback</Text>
          <Text style={styles.textLast}>{question.feedback}</Text>
        </View>
      )}
    </View>
  );
}
