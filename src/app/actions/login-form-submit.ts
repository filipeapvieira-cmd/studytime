"use server";
import { formSchema } from "@/src/lib/schemas/loginFormSchema";

export type FormState = {
  message: string;
};

export async function onSubmitAction(data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  console.log(formData);
  // Server-side validation
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: parsed.error.errors[0].message };
  }

  return { message: "Success" };
}
