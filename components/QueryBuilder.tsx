import React from "react";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";
import { generateSQLQuery } from "@/lib/utils";
import { Input } from "./ui/input";
import { Mandatory } from "./Mandatory";
import { Settings } from "lucide-react";

export interface Condition {
  column_name: string;
  operator: string;
  value: string;
  reason: string;
}

interface GenerateQueryProps {
  table: string;
  conditions: Condition[];
  onRemoveCondition: (index: number, table: string) => void;
}

export default function GenerateQuery({
  table,
  conditions,
  onRemoveCondition,
}: GenerateQueryProps) {
  return (
    <div className="w-1/2">
      <h1 className="mb-2 flex justify-center font-bold text-lg">
        Proposed Query
      </h1>
      <Formik
        initialValues={{ conditions, requestor: "", org: "" }}
        onSubmit={async (values) => {
          const sqlQuery = generateSQLQuery(conditions, table);
          const blob = new Blob([sqlQuery]);
          saveAs(
            blob,
            `${values.requestor}-${
              values.org
            }-${table}-${new Date().toLocaleTimeString()}_${new Date().toLocaleDateString()}.sql`
          );
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <div className="flex gap-2 items-center mb-1">
              <label className="font-bold flex">
                Requestor <Mandatory />
              </label>
              <Input
                name="requestor"
                placeholder="Your Name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-2 items-center mb-1">
              <label className="font-bold flex">
                Organisation <Mandatory />
              </label>
              <Input
                name="org"
                placeholder="Your Organisation"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-2 items-center mb-1">
              <label className="font-bold">Table:</label>
              {table}
            </div>
            <FieldArray name="conditions">
              {() => (
                <div className="flex flex-col">
                  <h1 className="font-bold mb-1">Conditions:</h1>
                  {conditions.length > 0 &&
                    conditions.map((condition, index) => (
                      <div
                        className="flex gap-3 border rounded-xl justify-between p-3 mb-2"
                        key={index}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex gap-3  justify-center">
                            <div className="flex flex-col gap-2 items-center">
                              <label className="font-bold">Column</label>
                              {condition.column_name}
                              <ErrorMessage
                                name={`column_name`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                              <label className="font-bold">Operator</label>
                              {condition.operator}
                              <ErrorMessage
                                name={`operator`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                              <label className="font-bold">Value</label>
                              {condition.value}
                              <ErrorMessage
                                name={`value`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-start">
                            <label className="font-bold">Reason:</label>
                            {condition.reason}
                            <ErrorMessage
                              name={`reason`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                        </div>
                        <div className="col">
                          <Button
                            type="button"
                            size={"sm"}
                            variant={"destructive"}
                            onClick={() => onRemoveCondition(index, table)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            <div className="flex justify-center">
              <Button className="mt-3 text-md items-center" type="submit">
                Generate SQL query <Settings />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
