"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInput from "@/components/TextInput";
import TextInputTwo from "@/components/TextInputTwo";
import TextInputThree from "@/components/TextInputThree";
import TextInputFour from "@/components/TextInputFour";
import TextInputFive from "@/components/TextInputFive";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/Form";
import { FormValuesProvider } from "@/components/FormValuesContext";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  // type FormValues = z.infer<typeof formSchema>;
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* valid name */}
        <input type="text" {...methods.register("firstName")} />
        {/* invalid name, caught by ts */}
        <input type="text" {...methods.register("bingBong")} />
        {/* valid name */}
        <TextInput name="firstName" />
        {/* invalid name, ts doesn't catch it */}
        <TextInput name="bingBong" />
        {/* invalid name, ts catches it but requires this gross <FormValues> generic type */}
        {/* <TextInput<FormValues> name="bingBong" /> */}
        {/* invalid name, ts doesn't catch it */}
        <TextInputTwo name="bingBong" />
        {/* invalid name, ts doesn't catch it */}
        <TextInputThree name="bingBong" />
        {/* invalid name, ts doesn't catch it */}
        {/* <TextInputFour fieldValues={FormValues} name="bingBong" /> */}
        {/* invalid name, ts doesn't catch it */}
        <TextInputFive name="bingBong" />
        {/* invalid name, ts catches it but requires redundently passing control */}
        <FormField
          control={methods.control}
          name="bingBong" // should be "firstName" or "lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <input type="text" placeholder="frog" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
