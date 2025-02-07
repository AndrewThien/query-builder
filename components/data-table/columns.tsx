"use client";

import { Columns } from "@/types/table";
import { ColumnDef } from "@tanstack/react-table";
import AccordionFormik from "../AccordionFormik";

export const columns = (
  addCondition: (
    column_name: string,
    operator: string,
    value: string,
    reason: string,
    table: string
  ) => void
): ColumnDef<Columns>[] => [
  {
    header: "Column Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const column_name = row.original.name;
      const table = row.original.table;
      return (
        <AccordionFormik
          column_name={column_name}
          table={table}
          addCondition={addCondition}
        />
      );
    },
  },
  {
    accessorKey: "data_type",
    header: "Data Type",
    cell: ({ row }) => {
      const data_type = row.original.data_type;
      return data_type.toUpperCase();
    },
  },
  {
    accessorKey: "max_length",
    header: "Max Length",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "primary",
    header: "Primary",
  },
];
