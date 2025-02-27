import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Mandatory } from "./core/Mandatory";
import { Settings } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { Condition } from "@/types";
import { useGlobalState } from "@/components/core/GlobalStateContext";
import { useRouter } from "next/navigation";

interface GenerateQueryProps {
  table: string;
  conditions: Condition[];
  onRemoveCondition: RemoveConditionInterface;
}

export default function GenerateQueryForm({
  table,
  conditions,
  onRemoveCondition,
}: GenerateQueryProps) {
  const { setReviewData } = useGlobalState();
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  return (
    <div className="w-1/2">
      <h1 className="mb-2 flex justify-center font-bold text-xl">
        Proposed Query
      </h1>
      <Formik
        initialValues={{
          conditions,
          requestor: "",
          org: "",
          general_reason: "",
          comment: "",
        }}
        onSubmit={async (values) => {
          // POST to Next's API
          setProcessing(true);
          const response = await fetch("/api/generate_SQL", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ table, conditions }),
          });
          // If response is failling, unpack and show the error message on the UI
          if (!response.ok) {
            const errorMessage = await response.json();
            toast.error(`Generate SQL query failed. ${errorMessage.error}`);
            setProcessing(false);
            return;
          }
          // Unpack the response, set the global state value, then push to the `review` page
          const sqlQuery = await response.json();
          setProcessing(false);
          toast.success("Generate SQL query successful!");
          setReviewData({
            conditions,
            requestor: values.requestor,
            org: values.org,
            general_reason: values.general_reason,
            comment: values.comment,
            table: table,
            sql_query: sqlQuery,
          });
          router.push("/review");
        }}
      >
        {({ values, handleChange }) => (
          // TODO: Make the widths of form fields nicer
          <Form>
            {/* Request information */}
            <div className="flex gap-2 items-center mb-1">
              <label className="flex w-[170px]">
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
              <label className="flex w-[170px]">
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
              <label className="flex w-[170px]">
                Reason <Mandatory />
              </label>
              <Textarea
                name="general_reason"
                placeholder="General reason for requesting this data"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-2 items-center mb-1">
              <label className="flex w-[170px]">
                Comment <Mandatory />
              </label>
              <Textarea
                name="comment"
                placeholder="General comment"
                onChange={handleChange}
                required
              />
            </div>
            {/* Filters information */}
            <div className="flex gap-2 items-center mt-4 mb-1">
              <label>Table:</label>
              <h1 className="font-bold">{table}</h1>
            </div>
            <FieldArray name="conditions">
              {() => (
                <div className="flex flex-col">
                  <h1 className="mb-1">Conditions:</h1>
                  {conditions.length > 0 &&
                    conditions.map((condition, index) => (
                      <div
                        className="flex gap-3 border border-input rounded-xl justify-between p-3 mb-2"
                        key={index}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex gap-3  justify-center">
                            <div
                              className={cn(
                                "flex gap-2 items-center",
                                condition.value && "flex-col"
                              )}
                            >
                              <label className="font-bold flex">
                                Column {!condition.value && ":"}{" "}
                              </label>
                              {condition.column_name}
                            </div>
                            {condition.operator && (
                              <div className="flex flex-col gap-2 items-center">
                                <label className="font-bold">Operator</label>
                                {condition.operator}
                              </div>
                            )}
                            {condition.value && (
                              <div className="flex flex-col gap-2 items-center">
                                <label className="font-bold">Value</label>
                                {condition.value.replace(/["]/g, "")}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 justify-start">
                            <label className="font-bold">Reason:</label>
                            {condition.reason}
                          </div>
                        </div>
                        <div className="col">
                          <Button
                            type="button"
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => onRemoveCondition(index, table)}
                            className="text-red-500"
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            {/* Submit button */}
            <div className="flex justify-center">
              {processing ? (
                <Button className="mt-3 text-md items-center" disabled>
                  Processing Query...
                </Button>
              ) : (
                <Button className="mt-3 text-md items-center" type="submit">
                  Generate Query <Settings />
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
