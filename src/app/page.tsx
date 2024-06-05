'use client';

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "@/components/TextInput";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export default function Home() {
  type FormValues = z.infer<typeof formSchema> & { [key: string]: string };

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInput name="firstName" label="First Name" />
        <TextInput name="lastName" label="Last Name" />
        <TextInput<FormValues> name="notInFormSchema" label="Not In Form Schema" /> {/* Add new TextInput */}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
