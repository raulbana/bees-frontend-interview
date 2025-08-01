import z from "zod";

const loginFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only alphabetical characters are allowed")
    .refine((value) => {
      const names = value.trim().split(/\s+/);
      return names.length >= 2 && names[0].length > 0 && names[1].length > 0;
    }, "Please enter your first and last name"),
  isOver18: z.boolean().refine((value) => value === true, "You must be over 18 years old"),
});

export default loginFormSchema;
export type LoginFormValues = z.infer<typeof loginFormSchema>;