import React from "react";
import ReactDOM from "react-dom";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";
import { FormikInput } from "./FormikInput";
interface Condition {
  column_name: string;
  operator: string;
  value: string;
}

interface FormValues {
  conditions: Condition[];
}

const generateSQLQuery = (values: FormValues, table: string): string => {
  const { conditions } = values;
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

export const GenerateQuery = ({ table }: { table: string }) => (
  <div className="w-full">
    <h1 className="mb-2 flex justify-center font-bold text-lg">
      Proposed Query
    </h1>
    <Formik
      initialValues={{
        conditions: [
          {
            column_name: "",
            operator: "",
            value: "",
          },
        ],
      }}
      onSubmit={async (values) => {
        const sqlQuery = generateSQLQuery(values, table);
        const blob = new Blob([sqlQuery]);
        // alert(sqlQuery);
        saveAs(blob, "sql_query.sql");
      }}
    >
      {({ values }) => (
        <Form>
          <div className="flex gap-2 items-center mb-1">
            <label htmlFor={`table`}>Table:</label>
            {table}
          </div>
          <FieldArray name="conditions">
            {({ remove, push }) => (
              <div className="flex flex-col">
                <h1>Filters:</h1>
                {values.conditions.length > 0 &&
                  values.conditions.map((condition, index) => (
                    <div
                      className="flex gap-3 border rounded-xl justify-between p-3 mb-2"
                      key={index}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`conditions.${index}.column_name`}>
                            Column
                          </label>
                          <FormikInput
                            name={`conditions.${index}.column_name`}
                            placeholder="Column name"
                          />
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
                          <FormikInput
                            name={`conditions.${index}.operator`}
                            placeholder="<,>,>=,<=,=,!=,like,between"
                          />
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
                          <FormikInput
                            name={`conditions.${index}.value`}
                            placeholder="Value of the condition"
                          />
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
                <Button
                  type="button"
                  className="text-blue-500"
                  variant={"secondary"}
                  onClick={() =>
                    push({ column_name: "", operator: "", value: "" })
                  }
                >
                  Add Filter
                </Button>
              </div>
            )}
          </FieldArray>
          <div className="flex justify-center">
            <Button className="mt-3" type="submit">
              Generate query
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);
