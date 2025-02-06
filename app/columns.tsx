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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = (
  addFilter: (column_name: string, operator: string, value: string) => void
): ColumnDef<Columns>[] => [
  {
    header: "Column Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{name}</AccordionTrigger>
            <AccordionContent>
              <Formik
                initialValues={{
                  column_name: name,
                  operator: "",
                  value: "",
                }}
                onSubmit={async (values) => {
                  addFilter(values.column_name, values.operator, values.value);
                }}
              >
                {({ values, handleChange }) => (
                  <Form>
                    <div className="flex gap-2 items-end">
                      <div className="flex flex-col">
                        <div className="flex gap-3 justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                              <label>Operator</label>
                              <Input
                                name={`operator`}
                                onChange={handleChange}
                                placeholder="<,>,>=,<=,=,!=,like,between"
                              />
                              <ErrorMessage
                                name={`operator`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <div className="flex gap-2 items-center">
                              <label>Value</label>
                              <Input
                                name={`value`}
                                onChange={handleChange}
                                placeholder="Value of the condition"
                              />
                              <ErrorMessage
                                name={`value`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button type="submit">
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
