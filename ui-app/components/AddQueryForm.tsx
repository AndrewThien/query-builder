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

interface FormData {
  column_name: string;
  operator: string;
  value: string;
  reason: string;
  table: string;
  data_type: string;
  start: string;
  end: string;
}

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
  const handleSubmit = (values: FormData) => {
    const { operator, start, end, value: inputValue } = values;

    // Helper function to handle BETWEEN operator
    const handleBetweenOperator = () => {
      if (start >= end) {
        toast.error("Start value cannot be equal or greater than End value!");
        return null;
      }
      return `["${start}", "${end}"]`;
    };

    // Helper function to handle CONTAINS operator
    const handleContainsOperator = () => {
      return `[${inputValue
        .split(",")
        .map((item) => `"${item.trim()}"`)
        .join(",")}]`;
    };

    // Determine the value based on the operator
    let value;
    switch (operator) {
      case "BETWEEN":
        value = handleBetweenOperator();
        break;
      case "CONTAINS":
        value = handleContainsOperator();
        break;
      default:
        value = inputValue.toString();
        break;
    }

    // If value is null, it means there was an error (e.g., invalid BETWEEN values)
    if (value === null) return;

    // Actual action
    addCondition(
      values.column_name,
      values.operator,
      value,
      values.reason,
      values.table,
      values.data_type
    );
  };
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
        handleSubmit(values);
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
                {values.operator && (
                  <div className="flex gap-2 items-center">
                    <label className="flex">
                      Value <Mandatory />{" "}
                      {values.operator == "CONTAINS" && (
                        <Tooltips content="List of texts matching the values in the column, separated by a comma. For example: ABC, CDE, FGH" />
                      )}
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
