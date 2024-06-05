import { useFormContext, Controller, FieldPath } from "react-hook-form";
import { FieldValues } from "react-hook-form";

const useFormField = <TFieldValues extends FieldValues>(
  name: FieldPath<TFieldValues>
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  return { control, error: errors[name] };
};

export default useFormField;
