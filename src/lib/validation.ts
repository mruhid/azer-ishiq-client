import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z
  .object({
    email: requiredString.email("Invalid email address"),
    number: z.string().regex(/^\d+$/, "Only numbers are allowed"),
    username: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed",
    ),
    password: requiredString.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
    ),
    confirmingPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmingPassword, {
    message: "Passwords do not match",
    path: ["confirmingPassword"],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString.email("Invalid email address"),
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z
  .object({
    password: requiredString.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
    ),
    confirmingPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmingPassword, {
    message: "Passwords do not match",
    path: ["confirmingPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
