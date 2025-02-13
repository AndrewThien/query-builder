"use client";
import { useGlobalState } from "@/lib/GlobalStateContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";
import { PDFTemplate } from "./PDFTemplate";
import { saveAs } from "file-saver";

export default function Review() {
  const { reviewData } = useGlobalState();
  // TODO: Filter conditions of review Data first
  // Form the file name form cleaned form values + datetime value
  const fileName = `${reviewData.requestor.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  )}-${reviewData.org.replace(/[^a-zA-Z0-9]/g, "_")}-${
    reviewData.table
  }-${new Date().toLocaleTimeString()}_${new Date().toLocaleDateString()}.sql`;

  const printRef = React.useRef(null);

  const handleDownloadSQL = async () => {
    // Create blob from sqlQuery
    const blob = new Blob([reviewData.sql_query]);
    // Save the file locally for now
    saveAs(blob, fileName);
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <PDFTemplate printRef={printRef} reviewData={reviewData} />
        <div className="mt-6 flex gap-5 justify-center">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Download PDF
          </button>{" "}
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
