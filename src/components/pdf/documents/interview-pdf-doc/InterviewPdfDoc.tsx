import { Document, Page, View, Text } from "@react-pdf/renderer";
import { PdfSection } from "../components/PdfSection";
import { PdfQuestionBlock } from "../components/PdfQuestionBlock";
import { documentStyles } from "../document-styles";
import type { Question } from "@/types/interview";

interface InterviewPdfDocProps {
  questions: Question[];
  interviewTitle: string;
  overallRating: number;
}

export function InterviewPdfDoc({
  questions,
  interviewTitle,
  overallRating,
}: InterviewPdfDocProps) {
  return (
    <Document title={`Feedback - ${interviewTitle}`}>
      <Page size="A4" style={documentStyles.page}>
        <View style={documentStyles.pageHeader}>
          <Text style={documentStyles.docTitle}>Interview Feedback</Text>
          <Text style={documentStyles.docSubtitle}>{interviewTitle}</Text>
        </View>
        <View style={documentStyles.overallRating}>
          <Text style={documentStyles.overallRatingText}>
            Overall rating: ★ {overallRating.toFixed(1)} / 5
          </Text>
        </View>
        <PdfSection title="Questions & feedback">
          {questions.map((q, index) => (
            <PdfQuestionBlock
              key={q.id}
              question={q}
              index={index}
              showRating={true}
              showFeedback={true}
            />
          ))}
        </PdfSection>
        <Text style={documentStyles.footer}>
          Prepify — AI Mock Interview Practice • {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
