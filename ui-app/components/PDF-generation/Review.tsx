"use client";
import { useGlobalState } from "@/lib/GlobalStateContext";
import React from "react";
import { saveAs } from "file-saver";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "../ui/button";
import { PDFTemplate } from "./PDFTemplate";
import { Database, Download, File } from "lucide-react";

export default function Review() {
  const { reviewData } = useGlobalState();
  // TODO: Filter conditions of review Data first
  // Form the file name form cleaned form values + datetime value
  let fileName = "fileName";
  if (reviewData.requestor && reviewData.org) {
    fileName = `${reviewData.requestor.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}-${reviewData.org.replace(/[^a-zA-Z0-9]/g, "_")}-${
      reviewData.table
    }-${new Date().toLocaleTimeString()}_${new Date().toLocaleDateString()}`;
  }

  const handleDownloadSQL = async () => {
    // Create blob from sqlQuery
    const blob = new Blob([reviewData.sql_query]);
    // Save the file locally for now
    saveAs(blob, `${fileName}.sql`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-5 mb-10">
      <div className="mb-4 flex gap-5 justify-center">
        <Button onClick={handleDownloadSQL} className="flex gap-2 text-lg">
          Download SQL query <Database />
        </Button>
        <PDFDownloadLink
          document={<PDFTemplate reviewData={reviewData} />}
          fileName={`${fileName}.pdf`}
        >
          <Button className="flex gap-2 text-lg">
            Download PDF <File />
          </Button>
        </PDFDownloadLink>
      </div>
      <div className="w-full h-[700px]">
        <PDFViewer width="100%" height="100%">
          <PDFTemplate reviewData={reviewData} />
        </PDFViewer>
      </div>
    </div>
  );
}
