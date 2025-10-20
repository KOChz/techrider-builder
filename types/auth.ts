import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TLoginInput = z.infer<typeof loginSchema>;

export type TLoginState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export const signupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type TSignUpState = {
  success: boolean;
  needsEmailConfirmation?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
