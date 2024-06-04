import React from "react";
import {
  FieldPath,
  FieldValues,
  useFormContext,
  Controller,
} from "react-hook-form";

type TextInputProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
};

const TextInput = <TFieldValues extends FieldValues>({
  name,
}: TextInputProps<TFieldValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <input type="text" onChange={onChange} value={value} />
        )}
      />
      {errors[name] && <p>{errors[name]?.message?.toString()}</p>}
    </div>
  );
};

export default TextInput;
