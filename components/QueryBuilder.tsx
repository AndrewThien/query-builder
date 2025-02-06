import React, { useState } from "react";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";
import { FormikInput } from "./FormikInput";

export interface Condition {
  column_name: string;
  operator: string;
  value: string;
}

const generateSQLQuery = (conditions: Condition[], table: string): string => {
  if (!table) return "";
  let query = `SELECT * FROM ${table}`;
  if (conditions.length > 0) {
    const conditionStrings = conditions.map(
      ({ column_name, operator, value }) => {
        if (operator.toLowerCase() === "between") {
          const [val1, val2] = value.split(",");
          return `${column_name} BETWEEN '${val1.trim()}' AND '${val2.trim()}'`;
        }
        return `${column_name} ${operator} '${value}'`;
      }
    );
    query += ` WHERE ${conditionStrings.join(" AND ")}`;
  }
  return query;
};

const removeFilter = (index: number) => {};

interface GenerateQueryProps {
  table: string;
  conditions: Condition[];
}

export default function GenerateQuery({
  table,
  conditions,
}: GenerateQueryProps) {
  const [conditionsList, setConditions] = useState<Condition[]>(conditions);

  return (
    <div className="w-full">
      <h1 className="mb-2 flex justify-center font-bold text-lg">
        Proposed Query
      </h1>
      <Formik
        initialValues={{ conditions }}
        onSubmit={async () => {
          const sqlQuery = generateSQLQuery(conditions, table);
          const blob = new Blob([sqlQuery]);
          saveAs(blob, "sql_query.sql");
        }}
      >
        <Form>
          <div className="flex gap-2 items-center mb-1">
            <label htmlFor={`table`}>Table:</label>
            {table}
          </div>
          <FieldArray name="conditions">
            {({ remove }) => (
              <div className="flex flex-col">
                <h1>Filters:</h1>
                {conditionsList.length > 0 &&
                  conditionsList.map((condition, index) => (
                    <div
                      className="flex gap-3 border rounded-xl justify-between p-3 mb-2"
                      key={index}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`conditions.${index}.column_name`}>
                            Column
                          </label>
                          {condition.column_name}
                          <ErrorMessage
                            name={`conditions.${index}.column_name`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`conditions.${index}.operator`}>
                            Operator
                          </label>
                          {condition.operator}
                          <ErrorMessage
                            name={`conditions.${index}.operator`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`conditions.${index}.value`}>
                            Value
                          </label>
                          {condition.value}
                          <ErrorMessage
                            name={`conditions.${index}.value`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                      </div>
                      <div className="col">
                        <Button
                          type="button"
                          className="text-red-500"
                          variant={"ghost"}
                          onClick={() => remove(index)}
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
            <Button className="mt-3" type="submit">
              Generate query
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
