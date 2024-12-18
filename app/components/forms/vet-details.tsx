import React, { useRef, useEffect } from 'react'
import { Form } from '@remix-run/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Loader2 } from 'lucide-react'
import { useIsPending } from '#app/utils/misc'
import { Input } from '#app/components/ui/input'
import { Button } from '#app/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'
import type { SubmissionResult } from '@conform-to/react'
import { getFormProps, getInputProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { IVet } from '#app/models/veterinarian.interface.ts'
import { VetSchema } from '#app/models/veterinarian.interface.ts'

type VetDetailsProps = {
  lastResult?: SubmissionResult<string[]>
  veterinarian?: IVet
}

export default function VetDetails({ lastResult, veterinarian }: VetDetailsProps) {
  const titleRef = useRef<HTMLButtonElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  const [selectedQualification, setSelectedQualification] = React.useState('')
  const [selectedTitle, setSelectedTitle] = React.useState('')

  const qualifications = [
    { text: 'MRVC', value: 'MRVC' },
    { text: 'BRCS', value: 'BRCS' },
  ]

  const titles = [
    { text: 'Dr', value: 'Dr' },
    { text: 'Mr', value: 'Mr' },
    { text: 'Ms', value: 'Ms' },
    { text: 'Mrs', value: 'Mrs' },
  ]
  useEffect(() => {
    isHydrated && titleRef.current?.focus()
  }, [isHydrated])

  const [form, { fullName, title, qualification }] = useForm({
    lastResult,
    constraint: getZodConstraint(VetSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VetSchema })
    },
  })

  return (
    <Form
      method="POST"
      autoComplete="off"
      className="flex w-full flex-col items-start gap-2"
      {...getFormProps(form)}>
      {/* Security */}
      <AuthenticityTokenInput />
      <HoneypotInputs />

      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="title">Title</label>
        <Select
          onValueChange={(value) => {
            form.validate({ name: title.name })
            setSelectedTitle(value)
          }}
          defaultValue={veterinarian?.title}
          name="title">
          <SelectTrigger
            className={`SelectTrigger h-10 rounded border-primary/20 !px-2 hover:border-primary/40 ${
              title.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getSelectProps(title)}
            ref={titleRef}>
            <SelectValue placeholder="Select your title">
              {title.value || selectedTitle}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {titles.map(({ text, value }) => (
              <SelectItem
                key={value}
                value={value}
                className={`text-sm font-medium text-primary/60`}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {title.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {title.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="fullName">Full name</label>
        <Input
          placeholder="Full name"
          autoComplete="name"
          defaultValue={veterinarian?.fullName}
          className={`bg-transparent ${
            fullName.errors && 'border-destructive focus-visible:ring-destructive'
          }`}
          {...getInputProps(fullName, { type: 'text' })}
        />

        {fullName.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {fullName.errors.join(' ')}
          </span>
        )}
      </div>

      <div className="mb-2 flex w-full flex-col gap-1.5">
        <label htmlFor="qualification">Primary qualification</label>
        <Select
          onValueChange={(value) => {
            form.validate({ name: qualification.name })
            setSelectedQualification(value)
          }}
          defaultValue={veterinarian?.qualification}
          name="qualification">
          <SelectTrigger
            className={`SelectTrigger h-10 rounded border-primary/20 !px-2 hover:border-primary/40 ${
              qualification.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getSelectProps(qualification)}>
            <SelectValue placeholder="Select your primary qualification">
              {qualification.value || selectedQualification}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {qualifications.map(({ text, value }) => (
              <SelectItem
                key={value}
                value={value}
                className={`text-sm font-medium text-primary/60`}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {qualification.errors && (
          <span className="text-sm text-destructive dark:text-destructive-foreground">
            {qualification.errors.join(' ')}
          </span>
        )}
      </div>

      <Button type="submit" size="sm" className="mt-4">
        {isPending ? <Loader2 className="animate-spin" /> : 'Continue'}
      </Button>
    </Form>
  )
}
