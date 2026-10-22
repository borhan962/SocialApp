import * as z from "zod";

// Regex requiring:
// 1. At least one lowercase letter (?=.*[a-z])
// 2. At least one uppercase letter (?=.*[A-Z])
// 3. At least one numeric digit (?=.*\d)
// 4. At least one special character (?=.*[^A-Za-z0-9])
// 5. At least 8 characters in length (.{8,}$)
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .regex(
        passwordRegex,
        "At least 8 characters with uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm new password must match new password",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
