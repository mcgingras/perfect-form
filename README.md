# Perfect form challenge

I love react-hook-form. It's a great library for managing form state, and I use it in most of my projects. One of the perks of react-hook-form when used with typescript is that it will complain if you type to register a field that is not present in the defined form fields.

As an example, typescript will catch that "bingbong" is not within the formSchema and will complain about it. This is a huge help, since you can rely on typescript to let you know if you are correctly adhering to your form or not.

```typescript
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export default function Home() {
    type FormValues = z.infer<typeof formSchema>;
    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* valid name */}
            <input type="text" {...methods.register("firstName")} />
            {/* invalid name, caught by ts */}
            <input type="text" {...methods.register("bingBong")} />
        </form>
    )
}
```

I'd love to build out a component library with form input elements that have custom UI. This is already possible with the great work done by ShadCN. See below for an example of shadCN based component.

```typescript
// shadCN component
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
```

```typescript
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/Form";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export default function Home() {
  type FormValues = z.infer<typeof formSchema>;
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
```

In this example, typescript will complain within the FormField component letting us know that `name` of _bingBong_ is not a key in the form schema. This is great, and lets us create custom components that are typesafe.

### The problem
While ShadCN is great, I don't really love how you have to pass `control={methods.control}` over and over again for every component you use in the form. React-hook-form has a hook called `useFormContext` that lets us define our form in a provider then subscribe to it's state. This means we should be able to do something like this:

```typescript
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
```

```typescript
"use client";
import TextInput from "@/components/TextInput"

// same as before
// commenting out to save space
// const formSchema = ...

export default function Home() {
//   type FormValues = z.infer<typeof formSchema>;
//   const methods = useForm<FormValues>({
//     ...
//   });

  //function onSubmit ...

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInput name="bingBong" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

This component feels much better and it's much lighter weight to use. However, the type checking DOES NOT WORK! Feature wise, it will work. We are able to grab the control from `useFormContext` and the component works just fine. But when we use it, we can pass invalid names into the name prop and typescript does not complain about it.

The challenge here is to create a `<TextInput name="name" />` component that feels just as good to use as the example above AND the type-checking should work so typescript complains if you try to include a value for the name prop that does not exist within the schema. A winning solution does not include the same value as a prop across multiple instances of the component. For example, in shadCN I would have to do something like this:

```typescript
    <FormField
        control={methods.control}
        name="firstName"
        render={({ field }) => (
        <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl>
            <input type="text" placeholder="frog" {...field} />
            </FormControl>
        </FormItem>
        )}
    />
    <FormField
        control={methods.control}
        name="lastName"
        render={({ field }) => (
        <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
            <input type="text" placeholder="frog" {...field} />
            </FormControl>
        </FormItem>
        )}
    />
```

I'm passing the same value `methods.control` again and again for each instance of the component. I would instead like to do something like:

```typescript
    <TextInput name="firstName" />
    <TextInput name="lastName" >
```

where nothing is duplicated, it is instead found within the component using Context.

I've included 5 attempts in the `components` folder above. None of them work correctly. One solution that works is `TextInput.tsx` however, you have to pass the types as a generic to the component which looks horrible and you'd end up with the same problem of having the pass that generic to each instance of the component. Somehow, the ShadCN solution is able to get around this problem, but I think it may be because you are also passing control which is giving it the context it needs.

```typescript
 <TextInput<FormValues> name="bingBong" />
```

If this is impossible, I'm sorry, but I'm not a typescript wizard. My grail component would look like `<TextInput name="firstName" />` and would be typesafe.
