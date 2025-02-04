"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGlobalState } from "@/lib/GlobalStateContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page: React.FC = () => {
  const { csvData } = useGlobalState();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="flex justify-between items-center mb-6">
        <h1>Table Metadata</h1>
        <Link href="/upload">
          <Button>Upload CSV</Button>
        </Link>
      </div>

      {csvData.length > 0 ? (
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={csvData} />
        </div>
      ) : (
        <div className="text-center py-10">
          No data available. Please upload a CSV file.
        </div>
      )}
    </div>
  );
};

export default Page;
