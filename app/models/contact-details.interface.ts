import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const ContactDetailsSchema = z.object({
  address_line_one: z
    .string({ required_error: 'Please enter an address' })
    .min(3, { message: 'Name must be a least 3 characters' })
    .trim()
    .regex(/^[\w\s]+$/, {
      message: 'Address may only contain alphanumeric characters.',
    }),

  address_line_two: z
    .string()
    .trim()
    .regex(/^[\w\s]+$/, {
      message: 'Address may only contain alphanumeric characters.',
    })
    .optional(),
  county: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Address may only contain alphanumeric characters.',
    })
    .optional(),
  town_or_city: z
    .string({ required_error: 'Please enter a town or city' })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Town or city may only contain alphanumeric characters.',
    }),
  postcode: z
    .string({ required_error: 'Please enter a postcode' })
    .min(4, {
      message: 'Postcode must have at least 4 characters',
    })
    .max(8, {
      message: 'Postcode must have at most 8 characters',
    })
    .trim()
    .regex(/^[\w\s]+$/, {
      message: 'Town or city may only contain alphanumeric characters.',
    }),

  phonenumber: z
    .string({ required_error: 'Please enter a phonenumber' })
    .trim()
    .refine((val) => isValidPhoneNumber(val, 'GB'), {
      message: 'Please enter a valid phonenumber',
    }),
})

export type IContactDetails = z.infer<typeof ContactDetailsSchema>
