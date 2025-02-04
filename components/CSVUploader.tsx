"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableMetaData } from "@/types/table";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";
import { cleanColumnDescription } from "@/lib/utils";

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const { setCsvData } = useGlobalState();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  // TODO: clean the csv file before passing to the fornt page
  const parseCSV = (text: string): TableMetaData[] => {
    const rows = text?.split("\n").map((row) => row.split(","));
    const cleanedRows = cleanColumnDescription(rows);
    // Skip header row and map remaining rows to TableMetaData structure
    return cleanedRows.slice(1).map((row) => ({
      section: row[0] || "",
      column_name: row[1] || "",
      data_type: row[2] || "",
      column_description: row[3] || "",
      sensitive: row[4] === "true",
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const parsedData = parseCSV(text);
      setCsvData(parsedData);

      alert("File processed successfully");
      setFile(null);
      // Navigate to the main page to view the data
      router.push("/");
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-md mx-auto mt-10">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="w-full"
      />
      <Button onClick={handleUpload} disabled={!file} className="w-full">
        Upload CSV
      </Button>
    </div>
  );
}
