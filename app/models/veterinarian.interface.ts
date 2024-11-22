import { z } from 'zod'

export const VetSchema = z.object({
  fullName: z
    .string({ required_error: 'Please enter your name' })
    .min(3, { message: 'Name must be a least 3 characters' })
    .trim()
    .regex(/^[a-zA-Z]+$/, {
      message: 'Username may only contain alphanumeric characters.',
    }),
  primaryQualification: z
    .string({ required_error: 'Please select your primary qualification' })
    .trim(),
  title: z.string({ required_error: 'Please select a title' }).trim(),
})

export type IVet = z.infer<typeof VetSchema>
export type IVetErrors = Partial<Record<keyof IVet, string[]>>
