"use client";

import React, { useState } from "react";
import { parse } from "csv-parse";
import { TableMetaData } from "../types/table";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<TableMetaData[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setErrorMessage("Please select a file.");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setErrorMessage("Please upload a CSV file.");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const records: TableMetaData[] = [];

      // Initialize the parser
      const parser = parse({
        delimiter: ",",
        columns: true,
        trim: true,
        skip_empty_lines: true,
        relax_quotes: true,
      });
      // Use the readable stream api to consume records
      parser.on("readable", function () {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });
      // Catch any error
      parser.on("error", function (err) {
        console.error(err.message);
      });
      // Test that the parsed records matched the expected records
      parser.on("end", function () {
        setCsvData(records);
        setErrorMessage("");
        setIsLoading(false);
      });
      // Write data to the stream
      parser.write(text);
      // Close the readable stream
      parser.end();

      // Clean the rows
      // const cleanedRows = cleanColumnDescription(rows);

      console.log("🚀 ~ handleFileUpload ~ records:", records);
    };
    console.log("🚀 ~ csvData:", csvData);
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Loading Data from File</h1>

      <input
        type="file"
        onChange={handleFileUpload}
        accept=".csv"
        style={{ marginBottom: "10px" }}
      />

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
      ) : (
        csvData.length > 0 && (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={csvData} />
          </div>
        )
      )}
    </div>
  );
};

export default Page;
