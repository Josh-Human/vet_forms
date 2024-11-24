import { useRef, useEffect } from 'react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Input } from '#app/components/ui/input'
import type { SubmissionResult } from '@conform-to/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { IContactDetails } from '#app/models/contact-details.interface.ts'
import { ContactDetailsSchema } from '#app/models/contact-details.interface.ts'
import { Form } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useIsPending } from '#app/utils/misc.ts'

type ContactDetailsProps = {
  lastResult?: SubmissionResult<string[]>
  contact_details?: IContactDetails
}

export default function ContactDetails({
  lastResult,
  contact_details,
}: ContactDetailsProps) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  useEffect(() => {
    isHydrated && titleRef.current?.focus()
  }, [isHydrated])

  const [
    form,
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
    <Form
      method="POST"
      className="flex w-full flex-col items-start gap-2"
      {...getFormProps(form)}>
      {/* Security */}
      <AuthenticityTokenInput />
      <HoneypotInputs />
      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="phonenumber">Phonenumber</label>
        <Input
          autoComplete="tel"
          defaultValue={contact_details?.phonenumber}
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
          defaultValue={contact_details?.address_line_one}
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
          defaultValue={contact_details?.address_line_two}
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
          defaultValue={contact_details?.town_or_city}
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
          defaultValue={contact_details?.county}
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
          defaultValue={contact_details?.postcode}
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
      <Button type="submit" size="sm" className="mt-4">
        {isPending ? <Loader2 className="animate-spin" /> : 'Continue'}
      </Button>
    </Form>
  )
}
