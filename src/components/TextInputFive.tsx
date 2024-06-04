import React from "react";
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";

interface TextInputProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  placeholder?: string;
}
const TextInputFive = <TFieldValues extends FieldValues>({
  name,
  placeholder,
}: TextInputProps<TFieldValues>) => {
  const { register } = useFormContext<TFieldValues>();
  return <input {...register(name)} placeholder={placeholder} />;
};
export default TextInputFive;
