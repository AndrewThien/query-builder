"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { styles } from "@/lib/style";

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, styles.textBold]}>INVOICEw</Text>
          <Text>Invoice #INV-2024-001</Text>
        </View>
        <View style={styles.spaceY}>
          <Text style={styles.textBold}>Company Name</Text>
          <Text>123 Business Street</Text>
          <Text>City, State 12345</Text>
        </View>
      </View>

      <View style={styles.spaceY}>
        <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
        <Text>Client Name</Text>
        <Text>Client Address</Text>
        <Text>City, State ZIP</Text>
      </View>
      {/* Render the table */}
    </Page>
  </Document>
);
