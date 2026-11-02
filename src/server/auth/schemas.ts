import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    password: z.string().min(8).max(128),
    organizationName: z.string().trim().min(1).max(120),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
