import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import { data, redirect } from '@remix-run/node'
import { parseWithZod } from '@conform-to/zod'
import { requireSessionUser, requireUser } from '#app/modules/auth/auth.server'

import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import VetDetails from '#app/components/forms/vet-details.tsx'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { IVet } from '#app/models/veterinarian.interface.ts'
import { VetSchema } from '#app/models/veterinarian.interface.ts'
import { prisma } from '#app/utils/db.server.ts'

export const ROUTE_PATH = '/onboarding/vet' as const

export const meta: MetaFunction = () => {
  return [{ title: 'VetForms Onboarding - Veterinarian Details' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  const vet = await prisma.veterinarian.findFirst({
    where: { userId: user.id },
  })
  return { vet }
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: VetSchema })
  if (submission.status !== 'success') {
    return data(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  const model = submission.value

  await prisma.veterinarian.upsert({
    where: { userId: user.id },
    update: {
      fullName: model.fullName,
      title: model.title,
      qualification: model.qualification,
    },
    create: {
      userId: user.id,
      fullName: model.fullName,
      title: model.title,
      qualification: model.qualification,
    },
  })

  return redirect('/onboarding/practice')
}

export default function OnboardingVetDetails() {
  const lastResult = useActionData<typeof action>()
  const { vet } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto mt-36 flex h-full w-full max-w-96 flex-col items-center">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-2xl font-medium text-primary">Veterinarian details</h3>
        <p className="text-base font-normal text-primary/60">
          Let's get started by adding your details. These will be used to pre-fill your
          AHCs in the future.
        </p>
      </div>
      <VetDetails lastResult={lastResult?.data} veterinarian={vet as IVet} />
    </div>
  )
}
