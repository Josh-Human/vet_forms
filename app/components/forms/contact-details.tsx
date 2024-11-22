import { useRef, useEffect } from 'react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Input } from '#app/components/ui/input'
import type { SubmissionResult } from '@conform-to/react'
import { getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { ContactDetailsSchema } from '#app/models/contact-details.interface.ts'

type ContactDetailsProps = {
  lastResult?: SubmissionResult<string[]>
}

export default function ContactDetails({ lastResult }: ContactDetailsProps) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const isHydrated = useHydrated()

  useEffect(() => {
    isHydrated && titleRef.current?.focus()
  }, [isHydrated])

  const [
    ,
    { address_line_one, address_line_two, town_or_city, county, postcode, phonenumber },
  ] = useForm({
    lastResult,
    constraint: getZodConstraint(ContactDetailsSchema),
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactDetailsSchema })
    },
  })

  return (
    <>
      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="phonenumber">Phonenumber</label>
        <Input
          autoComplete="tel"
          defaultValue={phonenumber.value || ''}
          className={`bg-transparent ${
            phonenumber.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(phonenumber, { type: 'text' })}
        />

        {phonenumber.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {phonenumber.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="address_line_one">Address line one (or company name)</label>
        <Input
          autoComplete="address-line1"
          defaultValue={address_line_one.value || ''}
          className={`bg-transparent ${
            address_line_one.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(address_line_one, { type: 'text' })}
        />

        {address_line_one.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {address_line_one.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="address_line_two">Address line two (optional)</label>
        <Input
          autoComplete="addres-line2"
          defaultValue={address_line_two.value || ''}
          className={`bg-transparent ${
            address_line_two.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(address_line_two, { type: 'text' })}
        />

        {address_line_two.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {address_line_two.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-8/12 flex-col gap-1.5">
        <label htmlFor="town_or_city">Town or city</label>
        <Input
          autoComplete="address-level2"
          defaultValue={town_or_city.value || ''}
          className={`bg-transparent ${
            town_or_city.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(town_or_city, { type: 'text' })}
        />

        {town_or_city.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {town_or_city.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-8/12 flex-col gap-1.5">
        <label htmlFor="county">County (optional)</label>
        <Input
          defaultValue={county.value || ''}
          className={`bg-transparent ${
            county.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(county, { type: 'text' })}
        />

        {county.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {county.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-8/12 flex-col gap-1.5">
        <label htmlFor="postcode">Postcode</label>
        <Input
          autoComplete="postal-code"
          defaultValue={postcode.value || ''}
          className={`w-44 bg-transparent ${
            postcode.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(postcode, { type: 'text' })}
        />

        {postcode.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {postcode.errors.join(' ')}
          </span>
        )}
      </div>
    </>
  )
}
