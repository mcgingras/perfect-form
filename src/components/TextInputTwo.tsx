import React from "react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

type TextInputProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
};

const TextInputTwo = <TFieldValues extends FieldValues>({
  name,
}: TextInputProps<TFieldValues>) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  return (
    <div>
      <input type="text" {...register(name)} />
      {errors[name] && <p>{errors[name]?.message?.toString()}</p>}
    </div>
  );
};

export default TextInputTwo;
