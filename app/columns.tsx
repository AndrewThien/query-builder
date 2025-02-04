"use client";

import { TableMetaData } from "@/types/table";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TableMetaData>[] = [
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "column_name",
    header: "Column Name",
  },
  {
    accessorKey: "data_type",
    header: "Data Type",
  },
  {
    accessorKey: "sensitive",
    header: "Sensitive",
  },
];
