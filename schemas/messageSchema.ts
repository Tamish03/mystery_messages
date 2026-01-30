import {z} from 'zod'

export const messageSchema = z.object({
  content: z.string()
    .min(10 , { message: "Message content cannot be empty" })
    .max(1000, { message: "Message content cannot exceed 1000 characters" }),
})