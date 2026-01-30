import {z} from 'zod'

export const verifySchema = z.object({
  verifyToken: z.string()
    .length(6, { message: "Invalid verification token" }),
})