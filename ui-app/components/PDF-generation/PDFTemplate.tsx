"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { styles } from "@/lib/style";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { ReviewData } from "@/types";

// Create Document Component
export const PDFTemplate = ({ reviewData }: { reviewData: ReviewData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, styles.textBold]}>Data Request</Text>
          <Text>
            {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.spaceY}>
          <Text style={styles.textBold}>Requestor</Text>
          <Text>{reviewData.requestor}</Text>
          <Text>{reviewData.org}</Text>
        </View>
      </View>

      <View style={styles.spaceY}>
        <Text style={[styles.general, styles.textBold]}>
          General Information
        </Text>
        <Text>Reason: {reviewData.general_reason}</Text>
        <Text>Comment: {reviewData.comment}</Text>
      </View>

      <View style={styles.tableTitle}>
        <Text>Table: {reviewData.table}</Text>
      </View>

      {/* Render the table */}
      <Table style={styles.table}>
        <TH style={[styles.tableHeader, styles.textBold]}>
          <TD style={styles.column_name}>Column Name</TD>
          <TD style={styles.td}>Data Type</TD>
          <TD style={styles.td}>Filter</TD>
        </TH>
        {reviewData.conditions?.map((condition, index) => (
          <React.Fragment key={index}>
            <TR>
              <TD style={styles.td}>{condition.column_name}</TD>
              <TD style={styles.td}>{condition.data_type.toUpperCase()}</TD>
              <TD style={styles.td}>
                {condition.operator ? condition.operator.toLowerCase() : "*"}{" "}
                {condition.value ? condition.value.replace(/["]/g, "") : ""}
              </TD>
            </TR>
            <TR>
              <TD style={styles.reason}>
                Reason for requesting the above data: {condition.reason}
              </TD>
            </TR>
          </React.Fragment>
        ))}
      </Table>
    </Page>
  </Document>
);
