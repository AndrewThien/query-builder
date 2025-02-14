import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#262626",
    fontFamily: "Helvetica",
    fontSize: "14px",
    padding: "30px 50px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  textBold: {
    fontFamily: "Helvetica-Bold",
  },
  tableTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 15,
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  general: {
    marginBottom: 5,
  },
  table: {
    width: "100%",
    borderColor: "1px solid #f3f4f6",
  },
  tableHeader: {
    backgroundColor: "#e5e5e5",
  },
  td: {
    padding: 6,
  },
  column_name: {
    padding: 6,
    width: "90%",
    flexWrap: "wrap",
  },
  reason: {
    padding: 6,
    width: "80%",
    flexWrap: "wrap",
  },
});
