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

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const substationSchema = z.object({
  name: z.string().min(1, "Substation name is required"),

  regionId: requiredString,

  districtId: requiredString,

  latitude: requiredString,

  longitude: requiredString,
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .nonempty("Address is required"),

  // image: z
  //   .instanceof(File)
  //   .nullable()
  //   .refine((file) => {
  //     if (!file) return true;
  //     return file.size <= MAX_FILE_SIZE;
  //   }, "Max image size is 2MB.")
  //   .refine((file) => {
  //     if (!file) return true;
  //     return ACCEPTED_IMAGE_TYPES.includes(file.type);
  //   }, "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

export type SubstationValues = z.infer<typeof substationSchema>;

export const upSubstationSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Substation name is required"),

  regionId: requiredString,

  districtId: requiredString,

  latitude: requiredString,

  longitude: requiredString,
  // address: z
  //   .string()
  //   .min(5, "Address must be at least 5 characters")
  //   .nonempty("Address is required"),

  // image: z
  //   .instanceof(File)
  //   .nullable()
  //   .refine((file) => {
  //     if (!file) return true;
  //     return file.size <= MAX_FILE_SIZE;
  //   }, "Max image size is 2MB.")
  //   .refine((file) => {
  //     if (!file) return true;
  //     return ACCEPTED_IMAGE_TYPES.includes(file.type);
  //   }, "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

export type UpSubstationValues = z.infer<typeof upSubstationSchema>;

export const NewSubstationSchema = z.object({
  name: z.string().min(1, "Substation name is required"), // Fix for required name field
  // image: z
  //   .any()
  //   .nullable()
  //   .refine((file) => {
  //     if (!file) return true; // No file uploaded is acceptable
  //     return file.size <= MAX_FILE_SIZE;
  //   }, `Max image size is 1MB.`)
  //   .refine((file) => {
  //     if (!file) return true; // No file uploaded is acceptable
  //     return ACCEPTED_IMAGE_TYPES.includes(file.type);
  //   }, "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

export type NewSubstationValues = z.infer<typeof NewSubstationSchema>;

export const tmSchema = z.object({
  name: z.string().min(1, "Substation name is required"), // Fix for required name field

  regionId: z.number(),

  districtId: z.number(),
  substationId: z.number(),

  latitude: requiredString,

  longitude: requiredString,

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .nonempty("Address is required"),
});

export type TMValues = z.infer<typeof tmSchema>;

export const subscriberSchema = z.object({
  name: z.string().min(1, "Subscriber name is required"),
  surname: z.string().min(1, "Subscriber surname is required"),
  patronymic: z.string().min(1, "Subscriber patronymic is required"),
  finCode: z
    .string()
    .min(7, "Subscriber finCode should be 7 symbols")
    .max(7, "Subscriber finCode should be 7 symbols"),
  phoneNumber: z
    .string()
    .regex(
      /^\+994(50|51|55|70|77|99)\d{7}$/,
      "Invalid Azerbaijani mobile number,bunber should start '+994'",
    ),
  regionId: z.number().optional(),
  districtId: z.number().optional(),
  territoryId: z.number().optional(),
  streetId: z.number().optional(),

  populationStatus: z.string().or(z.number().min(1).max(2)),
  building: z.string().min(1, "Subscriber building is required"),
  apartment: z.string().min(1, "Subscriber apartment is required"),
});

export type SubscriberValues = z.infer<typeof subscriberSchema>;

export const otpVerifySchema = z.object({
  email: requiredString.email("Invalid email address").optional(),
  otpCode: requiredString.min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type OtpVerifyValues = z.infer<typeof otpVerifySchema>;
