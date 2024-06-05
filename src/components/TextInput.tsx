import React from "react";
import { useFormContext, Controller, FieldPath, FieldValues } from "react-hook-form";

type TextInputProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
};

const TextInput = <TFieldValues extends FieldValues>({
  name,
  label,
}: TextInputProps<TFieldValues>) => {
  const { control, formState: { errors } } = useFormContext<TFieldValues>();

  return (
    <div>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => <input type="text" {...field} />}
      />
      {errors[name] && <p>{errors[name]?.message?.toString()}</p>}
    </div>
  );
};

export default TextInput;
