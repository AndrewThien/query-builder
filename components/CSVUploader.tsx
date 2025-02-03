"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      console.log("🚀 ~ reader.onload= ~ text:", text);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": "text/csv",
          },
        });

        if (response.ok) {
          alert("File uploaded successfully");
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
