import { z } from "zod";
import { VideoVisibility } from "./database_schemas";
export const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(10, "Password must be at most 10 characters long"),
    retypePassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(10, "Password must be at most 10 characters long"),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export const LoginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(10, "Password must be at most 10 characters long"),
    retypePassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(10, "Password must be at most 10 characters long"),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export const UploadVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Invalid URL"),
  visibility: z.nativeEnum(VideoVisibility, {
    errorMap: () => ({ message: "Invalid visibility value" }),
  }),
});

export const getVideosPaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val > 0, {
      message: "Limit must be greater than 0",
    }),
});
