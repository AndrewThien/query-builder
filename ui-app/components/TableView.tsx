"use client";
import React, { useState } from "react";
import GenerateQuery from "@/components/QueryBuilder";
import { COSD_table, SACT_table } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltips } from "@/components/Tooltips";
import { HowItWork } from "@/components/HowItWork";
import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";
import { Condition } from "@/types";

export default function TableView() {
  const [SACT_conditions, setConditionsSACT] = useState<Condition[]>([]);
  const [COSD_conditions, setConditionsCOSD] = useState<Condition[]>([]);

  const handleAddCondition = (
    column_name: string,
    operator: string,
    value: string,
    reason: string,
    table: string,
    data_type: string
  ) => {
    if (table == SACT_table.table) {
      setConditionsSACT((prevConditions) => [
        ...prevConditions,
        {
          column_name: column_name,
          operator: operator,
          value: value,
          reason: reason,
          data_type: data_type,
        },
      ]);
    } else if (table == COSD_table.table) {
      setConditionsCOSD((prevConditions) => [
        ...prevConditions,
        {
          column_name: column_name,
          operator: operator,
          value: value,
          reason: reason,
          data_type: data_type,
        },
      ]);
    }
  };

  const handleRemoveCondition = (index: number, table: string) => {
    if (table == SACT_table.table) {
      setConditionsSACT((prevConditions) =>
        prevConditions.filter((_, i) => i !== index)
      );
    } else if (table == COSD_table.table) {
    }
    setConditionsCOSD((prevConditions) =>
      prevConditions.filter((_, i) => i !== index)
    );
  };

  return (
    <Tabs defaultValue={SACT_table.table}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold flex">
          Available Table{" "}
          <Tooltips content="Tables that available inside Research View" />
        </h1>
        <TabsList className="">
          <a className="h-full">
            <TabsTrigger value={SACT_table.table}>
              {SACT_table.table} ({SACT_table.columns.length}){" "}
              <Tooltips
                content={`This table has ${SACT_table.columns.length} columns`}
              />
            </TabsTrigger>
          </a>
          <a className="h-full">
            <TabsTrigger value={COSD_table.table}>
              {COSD_table.table} ({COSD_table.columns.length}){" "}
              <Tooltips
                content={`This table has ${COSD_table.columns.length} columns. Will have much more!`}
              />
            </TabsTrigger>
          </a>
        </TabsList>
      </div>
      <TabsContent value={SACT_table.table}>
        <div className="flex gap-10 justify-between">
          <DataTable
            columns={columns(handleAddCondition)}
            data={SACT_table.columns}
          />
          {/* TODO: add filter column name to search */}
          {SACT_conditions.length > 0 ? (
            <GenerateQuery
              table={SACT_table.table}
              conditions={SACT_conditions}
              onRemoveCondition={handleRemoveCondition}
            />
          ) : (
            <></>
          )}
        </div>
      </TabsContent>
      <TabsContent value={COSD_table.table}>
        <div className="flex gap-10 justify-between">
          <DataTable
            columns={columns(handleAddCondition)}
            data={COSD_table.columns}
          />
          {COSD_conditions.length > 0 ? (
            <GenerateQuery
              table={COSD_table.table}
              conditions={COSD_conditions}
              onRemoveCondition={handleRemoveCondition}
            />
          ) : (
            <></>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
