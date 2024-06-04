import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  fieldValues: TFieldValues;
};

const TextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  fieldValues,
}: TextInputProps<TFieldValues, TName>) => {
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

export default TextInputFour;
