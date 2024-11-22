import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { parseWithZod } from '@conform-to/zod'
import { requireSessionUser } from '#app/modules/auth/auth.server'

import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import VetDetails from '#app/components/forms/vet-details.tsx'
import { useActionData } from '@remix-run/react'
import { VetSchema } from '#app/models/veterinarian.interface.ts'

export const ROUTE_PATH = '/onboarding/vet' as const

export const meta: MetaFunction = () => {
  return [{ title: 'Remix SaaS - Username' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: VetSchema })
  if (submission.status !== 'success') {
    return json(submission.reply(), { status: submission.status === 'error' ? 400 : 200 })
  }

  //   await prisma.user.upsert({ where: { id: user.id }, data: { username } })

  return redirect('/onboarding/practice')
}

export default function OnboardingVetDetails() {
  const lastResult = useActionData<typeof action>()

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-center text-2xl font-medium text-primary">
          Veterinarian details
        </h3>
        <p className="text-center text-base font-normal text-primary/60">
          Let's get started by adding your details. These will be used to pre-fill your
          AHCs in the future.
        </p>
      </div>
      <VetDetails lastResult={lastResult} />
    </div>
  )
}
