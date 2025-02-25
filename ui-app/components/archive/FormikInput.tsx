import { Field, FieldInputProps, FieldProps } from "formik";
import { Input } from "../ui/input";

const CustomSelect = ({
  field,
  form,
  placeholder,
}: {
  placeholder: string;
  field: FieldInputProps<any>;
  form: any;
}) => {
  return (
    <Input
      {...field}
      placeholder={placeholder}
      onChange={(e) => {
        field.onChange(e);
        // You can add additional onChange handling here if needed
      }}
    />
  );
};

export const FormikInput = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<any>) => (
        <CustomSelect field={field} form={form} placeholder={placeholder} />
      )}
    </Field>
  );
};
