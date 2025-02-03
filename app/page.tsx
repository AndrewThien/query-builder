"use client";

import React, { useState } from "react";

const cleanColumnDescription = (rows: string[][]): string[][] => {
  return rows.map((row) => {
    // Create a copy of the row to avoid mutating original
    const cleanedRow = [...row];

    // If the column description (4th column) spans multiple cells
    if (cleanedRow.length > 4) {
      // Combine additional cells into the description
      const description = cleanedRow
        .slice(3, cleanedRow.length - 1)
        .join(" ")
        .trim();

      // Keep only the first 4 original columns, with combined description
      return [
        cleanedRow[0],
        cleanedRow[1],
        cleanedRow[2],
        description,
        cleanedRow[cleanedRow.length - 1],
      ];
    }

    return cleanedRow;
  });
};

const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
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
      const rows = text?.split("\n").map((row) => row.split(","));

      // Clean the rows
      const cleanedRows = cleanColumnDescription(rows);

      setCsvData(cleanedRows);
      setErrorMessage("");
      setIsLoading(false);
    };

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
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{ border: "1px solid #ccc", padding: "8px" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default Page;
