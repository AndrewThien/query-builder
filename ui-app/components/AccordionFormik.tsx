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
import * as Yup from "yup";
import { Tooltips } from "./Tooltips";
import { DatePickerField } from "./DatePicker";
import { Textarea } from "./ui/textarea";
import { FormikSelect } from "./FormikSelect";
import Operators from "@/lib/operators";

export default function AccordionFormik({
  column_name,
  table,
  addCondition,
  data_type,
}: {
  column_name: string;
  table: string;
  data_type: string;
  addCondition: (
    column_name: string,
    operator: string,
    value: string,
    reason: string,
    table: string,
    data_type: string
  ) => void;
}) {
  const validationSchema = Yup.object().shape({
    operator: Yup.string().oneOf(
      [">", "<", "<=", ">=", "=", "<>", "!=", "!<", "!>", "BETWEEN", "LIKE"],
      `Supported operators are >,<,<=,>=,=,<>,!=,!<,!>,BETWEEN,LIKE.`
    ),
  });
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{column_name}</AccordionTrigger>
        <AccordionContent className="w-[250px]">
          <Formik
            initialValues={{
              column_name: column_name,
              operator: "",
              value: "",
              reason: "",
              table: table,
              data_type: data_type,
            }}
            onSubmit={async (values) => {
              addCondition(
                values.column_name,
                values.operator,
                // TODO: add % in the end of value if operator = LIKE
                values.value,
                values.reason,
                values.table,
                values.data_type
              );
            }}
            validationSchema={validationSchema}
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
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <div className="flex gap-2 items-center">
                        <label className="flex">Operator</label>
                        <FormikSelect
                          options={Operators({ data_type })}
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
                          {data_type == "date" || data_type == "datetime" ? (
                            <DatePickerField name="value" />
                          ) : (
                            <Input
                              name={`value`}
                              onChange={handleChange}
                              placeholder="Right-side value of the filter"
                              required
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
