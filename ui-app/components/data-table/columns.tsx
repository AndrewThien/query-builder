"use client";

import { Columns } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import AccordionFormik from "../AccordionFormik";

export const columns = (
  addCondition: (
    column_name: string,
    operator: string,
    value: string,
    reason: string,
    table: string,
    data_type: string
  ) => void
): ColumnDef<Columns>[] => [
  {
    header: "Column Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, table, data_type } = row.original;

      return (
        <AccordionFormik
          column_name={name}
          table={table}
          addCondition={addCondition}
          data_type={data_type}
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
