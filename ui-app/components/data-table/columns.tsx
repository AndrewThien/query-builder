"use client";

import { Columns } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import FormikAccordion from "../FormikAccordion";

export const columns = (
  addCondition: AddConditionInterface
): ColumnDef<Columns>[] => [
  {
    header: "Column Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, table, data_type } = row.original;

      return (
        <FormikAccordion
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
  // TODO: Confirm if these info needed when building data request?
  // {
  //   accessorKey: "description",
  //   header: "Description",
  // },
  // {
  //   accessorKey: "primary",
  //   header: "Primary",
  // },
];
