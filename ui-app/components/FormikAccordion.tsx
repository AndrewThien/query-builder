import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddQueryForm from "./AddQueryForm";

export default function FormikAccordion({
  column_name,
  table,
  addCondition,
  data_type,
}: {
  column_name: string;
  table: string;
  data_type: string;
  addCondition: AddConditionInterface;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{column_name}</AccordionTrigger>
        <AccordionContent className="w-[320px]">
          <AddQueryForm
            addCondition={addCondition}
            table={table}
            column_name={column_name}
            data_type={data_type}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
