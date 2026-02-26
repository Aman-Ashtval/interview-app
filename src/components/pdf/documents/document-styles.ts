import { StyleSheet } from "@react-pdf/renderer";

export const documentStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  pageHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#4c1d95",
  },
  docTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  docSubtitle: {
    fontSize: 10,
    color: "#717171",
  },
  overallRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f3e8ff",
    borderRadius: 6,
    gap: 8,
  },
  overallRatingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});
