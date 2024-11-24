import ContactDetails from '#app/components/forms/contact-details.tsx'
import { buttonVariants } from '#app/components/ui/button.tsx'
import {
  ContactDetailsSchema,
  IContactDetails,
} from '#app/models/contact-details.interface.ts'
import { requireSessionUser } from '#app/modules/auth/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { data, redirect } from '@remix-run/node'
import { Link, useActionData, useLoaderData } from '@remix-run/react'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login.$.tsx'
import { ChevronLeft } from 'lucide-react'
import { cn } from '#app/utils/misc.ts'
import { VET_PATH } from './_layout'
import type { SubmissionResult } from '@conform-to/react'
import { prisma } from '#app/utils/db.server.ts'
import { parsePhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js'

export const ROUTE_PATH = '/onboarding/practice' as const

export const meta: MetaFunction = () => {
  return [{ title: 'VetForms Onboarding - Practice Details' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  const resp = await prisma.veterinarian.findFirst({
    where: { userId: user.id },
    select: {
      practice: {
        select: {
          contact_details: true,
        },
      },
    },
  })
  return { contact_details: resp?.practice?.contact_details }
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  const user = await requireSessionUser(request, { redirectTo: LOGIN_PATH })

  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: ContactDetailsSchema })
  if (submission.status !== 'success') {
    return data(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  const model = submission.value

  const phoneNumber = parsePhoneNumberWithError(model.phonenumber)
  model.phonenumber = phoneNumber.formatInternational()

  const resp = await prisma.veterinarian.findUnique({
    include: {
      practice: {
        include: { contact_details: true },
      },
    },
    where: { userId: user.id },
  })

  const { id: contactId } = await prisma.contactDetails.upsert({
    where: { id: resp?.practice?.contact_details_id ?? -1 },
    update: {
      address_line_one: model.address_line_one,
      address_line_two: model.address_line_two,
      town_or_city: model.town_or_city,
      county: model.county,
      postcode: model.postcode,
      phonenumber: model.phonenumber,
    },
    create: {
      address_line_one: model.address_line_one,
      address_line_two: model.address_line_two,
      town_or_city: model.town_or_city,
      county: model.county,
      postcode: model.postcode,
      phonenumber: model.phonenumber,
    },
  })

  const { id: practiceId } = await prisma.practice.upsert({
    where: { id: resp?.practice_id ?? -1 },
    select: { id: true },
    update: {},
    create: {
      organisation_id: user.organisation_id,
      contact_details_id: contactId,
    },
  })

  await prisma.veterinarian.update({
    where: { userId: user.id },
    data: { practice_id: practiceId },
  })

  return redirect('/onboarding/practice')
}

export default function OnboardingPracticeDetails() {
  const lastResult: SubmissionResult<string[]> | undefined =
    useActionData<typeof action>()?.data
  const { contact_details } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto mt-16 flex h-full w-full max-w-96 flex-col items-center">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-2xl font-medium text-primary">Practice details</h3>
        <p className="text-base font-normal text-primary/60">
          Now let's add the details of your main practice branch.
        </p>
      </div>

      <Link
        to={VET_PATH}
        prefetch="intent"
        className={cn(`${buttonVariants({ variant: 'link' })} mb-2 self-start ps-0`)}>
        <span className={cn(`flex gap-1.5 font-normal`)}>
          <ChevronLeft className="h-4 w-4 stroke-[1.5px]" />
          Previous
        </span>
      </Link>

      <ContactDetails
        lastResult={lastResult}
        contact_details={contact_details as IContactDetails}></ContactDetails>
    </div>
  )
}
