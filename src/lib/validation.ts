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

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const substationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .nonempty("Name is required"),

  regionId: z
    .number()
    .nullable()
    .refine((value) => value !== null, "Region is required"),

  districtId: z
    .number()
    .nullable()
    .refine((value) => value !== null, "District is required"),

  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .nonempty("Address is required"),

  image: z
    .any()
    .nullable()
    .refine((file) => {
      if (file === null) return true; // No file uploaded is acceptable
      return file?.size <= MAX_FILE_SIZE;
    }, `Max image size is 1MB.`)
    .refine((file) => {
      if (file === null) return true; // No file uploaded is acceptable
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export type SubstationValues = z.infer<typeof substationSchema>;
