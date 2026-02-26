import { StyleSheet } from "@react-pdf/renderer";

export const pdfQuestionBlockStyles = StyleSheet.create({
  card: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 4,
    borderLeftColor: "#4c1d95",
    borderRadius: 4,
  },
  questionBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  ratingBadge: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#b45309",
    backgroundColor: "#fef3c7",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#717171",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a2e",
    marginBottom: 6,
  },
  textLast: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a2e",
    marginBottom: 0,
  },
  feedbackBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: "#f3e8ff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },
  feedbackLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4c1d95",
    marginBottom: 4,
  },
});
