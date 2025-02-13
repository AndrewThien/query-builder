import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { styles } from "./style";
import { tableData, totalData } from "./data";

export const InvoicePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, styles.textBold]}>INVOICE</Text>
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
      {/* <Table style={styles.table}>
        <TH style={[styles.tableHeader, styles.textBold]}>
          <TD style={styles.td}>Description</TD>
          <TD style={styles.td}>Quantity</TD>
          <TD style={styles.td}>Unit Price</TD>
          <TD style={styles.td}>Total</TD>
        </TH>
        {tableData.map((item, index) => (
          <TR key={index}>
            <TD style={styles.td}>{item.description}</TD>
            <TD style={styles.td}>{item.quantity}</TD>
            <TD style={styles.td}>${item.unitPrice.toFixed(2)}</TD>
            <TD style={styles.td}>${item.total.toFixed(2)}</TD>
          </TR>
        ))}
      </Table> */}

      <View style={styles.totals}>
        <View
          style={{
            minWidth: "256px",
          }}
        >
          {totalData.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
              key={index}
            >
              <Text style={item.label === "Total" ? styles.textBold : {}}>
                {item.label}
              </Text>
              <Text style={item.label === "Total" ? styles.textBold : {}}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);
