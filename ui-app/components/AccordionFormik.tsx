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
      [">", "<", "<=", ">=", "=", "<>", "!=", "!<", "!>", "BETWEEN"],
      `Supported operators are >,<,<=,>=,=,<>,!=,!<,!>,BETWEEN.`
    ),
  });
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
              data_type: data_type,
            }}
            onSubmit={async (values) => {
              addCondition(
                values.column_name,
                values.operator,
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
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="flex gap-2 items-center">
                        <label className="font-semibold flex">
                          Operator <Mandatory />{" "}
                          <Tooltips
                            content="Supported operators are >,<,<=,>=,=,<>,!=,!<,!>,BETWEEN."
                            link="https://learn.microsoft.com/en-us/sql/t-sql/language-elements/comparison-operators-transact-sql?view=sql-server-ver15"
                          />
                        </label>
                        <Input
                          name={`operator`}
                          onChange={handleChange}
                          placeholder="Comparison Operator"
                          required
                        />
                      </div>
                      <ErrorMessage
                        name={`operator`}
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <label className="font-semibold flex">
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
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <label className="font-semibold">Reason</label>
                      <Input
                        name={`reason`}
                        onChange={handleChange}
                        placeholder="Reason for requesting this"
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
}
