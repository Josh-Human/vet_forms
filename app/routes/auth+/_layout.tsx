import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { authenticator } from '#app/modules/auth/auth.server'
import { getDomainPathname } from '#app/utils/misc.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import Layout from '#app/components/side-image.tsx'

export const ROUTE_PATH = '/auth' as const

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH,
  })
  const pathname = getDomainPathname(request)
  if (pathname === ROUTE_PATH) return redirect(LOGIN_PATH)
  return json({})
}

export default function Login() {
  return <Layout element={<Outlet />}></Layout>
}
