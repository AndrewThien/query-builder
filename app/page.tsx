"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGlobalState } from "@/lib/GlobalStateContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InviteFriends } from "@/components/QueryBuilder";
import { Activity, Blocks } from "lucide-react";

const Page: React.FC = () => {
  const { csvData } = useGlobalState();
  console.log("🚀 ~ csvData:", csvData);

  return (
    <div className="container mx-auto my-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-500 flex items-center">
          Query Buider <Blocks className="ml-2" />
        </h1>
        <Link href="/upload">
          <Button>Upload CSV</Button>
        </Link>
      </div>

      {csvData.length > 0 ? (
        <div className="flex gap-10 justify-center">
          <DataTable columns={columns} data={csvData} />
          <InviteFriends />
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
