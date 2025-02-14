import { Field, FieldInputProps, FieldProps, FormikProps } from "formik";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Option } from "@/types";

const CustomSelect = ({
  field,
  form,
  isMulti = false,
  options,
  placeholder,
  required,
}: {
  options: Option[];
  placeholder?: string;
  isMulti: boolean;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  required?: boolean;
}) => {
  const animatedComponents = makeAnimated();
  const onChange = (newValue: any, actionMeta: any) => {
    const selectedValues = isMulti
      ? (newValue as Option[]).map((option) => option.label)
      : (newValue as Option).label;

    form.setFieldValue(field.name, selectedValues);
  };
  const selected = () => {
    return options
      ? options.filter((option: Option) =>
          Array.isArray(field.value)
            ? field.value.includes(option.label)
            : field.value === option.label
        )
      : [];
  };

  return (
    <Select
      name={field.name}
      value={selected()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      className="my-react-select-container"
      classNamePrefix="my-react-select"
      components={animatedComponents}
      menuPlacement="auto"
      menuPortalTarget={document.body} // Render the dropdown in the body
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 10 }), // Ensure the dropdown is on top
      }}
      required={required}
    />
  );
};

export const FormikSelect = ({
  options,
  name,
  placeholder,
  isMulti,
  required,
}: {
  options: Option[];
  name: string;
  placeholder?: string;
  isMulti: boolean;
  required?: boolean;
}) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<any>) => (
        <CustomSelect
          field={field}
          form={form}
          isMulti={isMulti}
          options={options}
          placeholder={placeholder}
          required={required}
        />
      )}
    </Field>
  );
};
