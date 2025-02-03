"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableMetaData } from "@/types/table";

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = (text: string): TableMetaData[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    return lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const values = line.split(",").map((value) => value.trim());
        return {
          section: values[0],
          column_name: values[1],
          data_type: values[2],
          column_description: values[3],
          sensitive: values[4].toLowerCase() === "true",
        };
      });
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

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedData),
        });

        if (response.ok) {
          alert("File uploaded successfully");
          setFile(null);
          if (document.querySelector('input[type="file"]')) {
            (
              document.querySelector('input[type="file"]') as HTMLInputElement
            ).value = "";
          }
        } else {
          alert("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
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
