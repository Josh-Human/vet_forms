import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLocation } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { requireUser } from '#app/modules/auth/auth.server'
import { getDomainPathname } from '#app/utils/misc.server'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from '#app/routes/onboarding+/username'
// import { Logo } from '#app/components/logo'
import { buttonVariants } from '#app/components/ui/button.tsx'
import { cn } from '#app/utils/misc.ts'
import { Header } from '#app/components/header.tsx'
import { Separator } from '#app/components/ui/separator.tsx'

export const ROUTE_PATH = '/onboarding' as const
export const VET_PATH = '/onboarding/vet' as const
export const PRACTICE_PATH = '/onboarding/practice' as const

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)

  const pathname = getDomainPathname(request)
  const isOnboardingPathname = pathname === ROUTE_PATH
  const isOnboardingUsernamePathname = pathname === ONBOARDING_USERNAME_PATH

  if (isOnboardingPathname) return redirect(DASHBOARD_PATH)
  if (user.username && isOnboardingUsernamePathname) return redirect(DASHBOARD_PATH)

  return json({})
}

export default function Onboarding() {
  const location = useLocation()
  const isVetPath = location.pathname === VET_PATH
  const isPracticePath = location.pathname === PRACTICE_PATH
  return (
    <div className="relative flex h-screen w-full flex-col">
      <div className="flex h-full w-full bg-secondary px-6 py-8">
        <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
            <Link
              to={VET_PATH}
              prefetch="intent"
              className={cn(
                `${buttonVariants({ variant: 'ghost' })} ${isVetPath && 'bg-primary/5'} justify-start rounded-md`,
              )}>
              <span
                className={cn(
                  `text-sm text-primary/80 ${isVetPath && 'font-medium text-primary'}`,
                )}>
                Veterinarian details
              </span>
            </Link>
            <Link
              to={PRACTICE_PATH}
              prefetch="intent"
              className={cn(
                `${buttonVariants({ variant: 'ghost' })} ${isPracticePath && 'bg-primary/5'} justify-start rounded-md`,
              )}>
              <span
                className={cn(
                  `text-sm text-primary/80 ${isPracticePath && 'font-medium text-primary'}`,
                )}>
                Practice details
              </span>
            </Link>
          </div>
          <Separator orientation="vertical"></Separator>
          <Outlet />
        </div>
      </div>
      {/* <div className="absolute left-1/2 top-8 mx-auto -translate-x-1/2 transform justify-center">
        <Logo />
      </div>
      <div className="z-10 h-screen w-screen">
        <Outlet />
      </div>
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" /> */}
    </div>
  )
}
