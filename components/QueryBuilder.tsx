import React from "react";
import ReactDOM from "react-dom";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Button } from "./ui/button";
import { Activity } from "lucide-react";
import { FormikInput } from "./FormikInput";

const initialValues = {
  table: "",
  conditions: [
    {
      column_name: "",
      operator: "",
      value: "",
    },
  ],
};

export const InviteFriends = () => (
  <div>
    <h1 className="mb-5 font-bold text-lg">Query builder</h1>
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          <div className="flex gap-2 items-center">
            <label htmlFor={`table`}>Table</label>
            <FormikInput name={`table`} placeholder="Column name" />
          </div>
          <FieldArray name="conditions">
            {({ remove, push }) => (
              <div className="flex flex-col gap-3">
                {values.conditions.length > 0 &&
                  values.conditions.map((friend, index) => (
                    <div className="flex gap-3" key={index}>
                      <div>
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
                        {/* TODO: add validation for OPERATOR: only one for one condition */}
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
                        {/* TODO: add validation for BETWEEN */}
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
