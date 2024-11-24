import ContactDetails from '#app/components/forms/contact-details.tsx'
import { Button, buttonVariants } from '#app/components/ui/button.tsx'
import { ContactDetailsSchema } from '#app/models/contact-details.interface.ts'
import { requireSessionUser } from '#app/modules/auth/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { data, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { cn, useIsPending } from '#app/utils/misc.ts'
import { VET_PATH } from './_layout'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import type { SubmissionResult } from '@conform-to/react'
import { getFormProps, useForm } from '@conform-to/react'

export const ROUTE_PATH = '/onboarding/practice' as const

export const meta: MetaFunction = () => {
  return [{ title: 'VetForms Onboarding - Practice Details' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  return {}
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: ContactDetailsSchema })
  if (submission.status !== 'success') {
    console.log(submission.reply())
    return data(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  //   await prisma.user.upsert({ where: { id: user.id }, data: { username } })

  return redirect('/onboarding/practice')
}

export default function OnboardingPracticeDetails() {
  const lastResult: SubmissionResult<string[]> | undefined =
    useActionData<typeof action>()?.data

  const isPending = useIsPending()

  const [form] = useForm({
    lastResult,
    constraint: getZodConstraint(ContactDetailsSchema),
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactDetailsSchema })
    },
  })
  return (
    <div className="mx-auto mt-36 flex h-full w-full max-w-96 flex-col items-center">
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
      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-2"
        {...getFormProps(form)}>
        {/* Security */}
        <AuthenticityTokenInput />
        <HoneypotInputs />
        <ContactDetails lastResult={lastResult}></ContactDetails>
        <Button type="submit" size="sm" className="mt-4">
          {isPending ? <Loader2 className="animate-spin" /> : 'Continue'}
        </Button>
      </Form>
    </div>
  )
}
