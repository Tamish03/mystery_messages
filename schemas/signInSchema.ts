import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
})
