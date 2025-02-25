import { Formik, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Mandatory } from "@/components/core/Mandatory";
import { Tooltips } from "./core/Tooltips";
import { Textarea } from "./ui/textarea";
import { FormikSelect } from "./FormikSelect";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import FindOperators from "./core/FindOperators";

export default function AddQueryForm({
  addCondition,
  column_name,
  table,
  data_type,
}: {
  addCondition: AddConditionInterface;
  column_name: string;
  table: string;
  data_type: string;
}) {
  return (
    <Formik
      initialValues={{
        column_name: column_name,
        operator: "",
        value: "",
        reason: "",
        table: table,
        data_type: data_type,
        start: "",
        end: "",
      }}
      // TODO: When LIKE is supported, find logic to add % in the end of value if operator = LIKE
      onSubmit={async (values) => {
        let value;
        // Check and Pre-process for BETWEEN situation
        if (values.operator == "BETWEEN" && values.start >= values.end) {
          toast.error("Start value cannot be equal or greater than End value!");
          return;
        }
        if (values.operator == "BETWEEN") {
          value = `["${values.start}", "${values.end}"]`;
        } else {
          value = values.value.toString();
        }

        // Check and Pre-process for CONTAINS situation
        if (values.operator == "CONTAINS") {
          value = values.value
            .split(",") // Make a list with splitter is ","
            .map((item) => `"${item.trim()}"`) // Trim whitespace and format each item
            .join(","); // Join items into a single string

          value = `[${value}]`; // Enclose the string in square brackets
        }
        // Actual action
        addCondition(
          values.column_name,
          values.operator,
          value,
          values.reason,
          values.table,
          values.data_type
        );
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <div className="flex flex-col gap-2 mt-1">
            {/* Reason field */}
            <div>
              <div className="flex gap-2 items-center">
                <label className="font-semibold flex">
                  Reason <Mandatory />
                </label>
                <Textarea
                  name={`reason`}
                  onChange={handleChange}
                  placeholder="Reason for requesting data in this column."
                  required
                />
              </div>
            </div>
            {/* Filter group */}
            <div className="flex gap-3 items-center">
              <h1 className="font-semibold flex">
                Filter{" "}
                <Tooltips content="Optional. If this is empty, all data in this column will be selected" />
              </h1>
              <div className="flex flex-col gap-2 border border-input p-2 rounded-md">
                <div className="flex gap-2 items-center">
                  <label className="flex">Operator</label>
                  <FormikSelect
                    options={FindOperators({ data_type })}
                    name="operator"
                    isMulti={false}
                    required={false}
                  />
                </div>
                <ErrorMessage
                  name={`operator`}
                  component="div"
                  className="text-red-500"
                />

                {values.operator && (
                  <div className="flex gap-2 items-center">
                    <label className="flex">
                      Value <Mandatory />
                    </label>
                    {values.operator == "BETWEEN" ? (
                      <div
                        className={cn(
                          "flex gap-1",
                          data_type == "int" || data_type == "float"
                            ? ""
                            : "flex-col"
                        )}
                      >
                        <Input
                          name={`start`}
                          onChange={handleChange}
                          placeholder="Start val."
                          required
                          type={
                            data_type == "int" || data_type == "float"
                              ? "number"
                              : "date"
                          }
                        />
                        <Input
                          name={`end`}
                          onChange={handleChange}
                          placeholder="End val."
                          required
                          type={
                            data_type == "int" || data_type == "float"
                              ? "number"
                              : "date"
                          }
                        />
                      </div>
                    ) : (
                      <Input
                        name={`value`}
                        onChange={handleChange}
                        placeholder="Right-side value of the filter"
                        required
                        type={
                          data_type == "int" || data_type == "float"
                            ? "number"
                            : data_type == "date" || data_type == "datetime"
                            ? "date"
                            : "text"
                        }
                      />
                    )}

                    <ErrorMessage
                      name={`value`}
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Submit button */}
            <div className="flex justify-center">
              <Button variant={"outline"} type="submit">
                Add to Query <Plus className="size-4" />{" "}
              </Button>
              <Tooltips content="If filter is empty, all data in the column will be selected." />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
