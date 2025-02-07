"use client";

import { Columns } from "@/types/table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Formik, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Mandatory } from "@/components/Mandatory";

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
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{column_name}</AccordionTrigger>
            <AccordionContent className="w-[255px]">
              <Formik
                initialValues={{
                  column_name: column_name,
                  operator: "",
                  value: "",
                  reason: "",
                  table: table,
                }}
                onSubmit={async (values) => {
                  addCondition(
                    values.column_name,
                    values.operator,
                    values.value,
                    values.reason,
                    values.table
                  );
                }}
              >
                {({ values, handleChange }) => (
                  <Form>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <label className="font-semibold flex">
                            Operator <Mandatory />
                          </label>
                          <Input
                            name={`operator`}
                            onChange={handleChange}
                            placeholder="<,>,>=,<=,=,!=,like,between"
                            required
                          />
                          <ErrorMessage
                            name={`operator`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label className="font-semibold flex">
                            Value <Mandatory />
                          </label>
                          <Input
                            name={`value`}
                            onChange={handleChange}
                            placeholder="Right-side value of the filter"
                            required
                          />
                          <ErrorMessage
                            name={`value`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2 items-center">
                          <label className="font-semibold">Reason</label>
                          <Input
                            name={`reason`}
                            onChange={handleChange}
                            placeholder="Reason for requesting this"
                          />
                          <ErrorMessage
                            name={`reason`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button variant={"outline"} type="submit">
                          Push <Plus className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
