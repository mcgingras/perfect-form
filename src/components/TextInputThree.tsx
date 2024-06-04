import React from "react";
import {
  FieldPath,
  FieldValues,
  useFormContext,
  Controller,
  ControllerProps,
} from "react-hook-form";

type TextInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  //   control: ControllerProps<TFieldValues, TName>;
};

const TextInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
}: //   control,
TextInputProps<TFieldValues, TName>) => {
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
