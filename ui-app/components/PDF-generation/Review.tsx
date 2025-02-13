"use client";
import { useGlobalState } from "@/lib/GlobalStateContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";
import { PDFTemplate } from "./PDFTemplate";
import { saveAs } from "file-saver";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "./ReactPDF";

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
    }-${new Date().toLocaleTimeString()}_${new Date().toLocaleDateString()}.sql`;
  }

  const printRef = React.useRef(null);

  const handleDownloadSQL = async () => {
    // Create blob from sqlQuery
    const blob = new Blob([reviewData.sql_query]);
    // Save the file locally for now
    saveAs(blob, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl h-[500px]">
        {/* <PDFTemplate printRef={printRef} reviewData={reviewData} /> */}
        <PDFViewer width="100%" height="100%">
          <MyDocument />
        </PDFViewer>
        <div className="mt-6 flex gap-5 justify-center">
          <PDFDownloadLink document={<MyDocument />} fileName="invoice.pdf">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
              Download PDF
            </button>
          </PDFDownloadLink>
          <button
            onClick={handleDownloadSQL}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Download SQL query
          </button>
        </div>
      </div>
    </div>
  );
}
