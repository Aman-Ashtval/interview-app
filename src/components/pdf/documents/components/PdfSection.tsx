import { View, Text } from "@react-pdf/renderer";
import { pdfSectionStyles } from "./pdf-section-styles";

interface PdfSectionProps {
  title: string;
  children: React.ReactNode;
}

export function PdfSection({ title, children }: PdfSectionProps) {
  return (
    <View style={pdfSectionStyles.section}>
      <Text style={pdfSectionStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
