"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGlobalState } from "@/lib/GlobalStateContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InviteFriends } from "@/components/QueryBuilder";
import { Blocks } from "lucide-react";
import { COSD_table, SACT_table } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltips } from "@/components/Tooltips";

const Page: React.FC = () => {
  const { csvData } = useGlobalState();

  return (
    <div className="container mx-24 my-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-500 flex items-center">
          Query Buider <Blocks className="ml-2" />
        </h1>
        <Link href="/upload">
          <Button disabled>Upload CSV</Button>
        </Link>
      </div>

      <div className="flex gap-10 justify-center">
        <div>
          <Tabs defaultValue={"SACT"}>
            <div className="flex items-center gap-2">
              <h1 className="text-lg flex">
                Available Table{" "}
                <Tooltips content="Tables that available inside Research View" />
              </h1>
              <TabsList className="">
                <a className="h-full">
                  <TabsTrigger value={SACT_table.table}>
                    {SACT_table.table}
                  </TabsTrigger>
                </a>
                <a className="h-full">
                  <TabsTrigger value={COSD_table.table}>
                    {COSD_table.table}
                  </TabsTrigger>
                </a>
              </TabsList>
            </div>
            <TabsContent value={SACT_table.table}>
              <DataTable columns={columns} data={SACT_table.columns} />
            </TabsContent>
            <TabsContent value={COSD_table.table}>
              <DataTable columns={columns} data={COSD_table.columns} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <InviteFriends />
        </div>
      </div>
    </div>
  );
};

export default Page;
