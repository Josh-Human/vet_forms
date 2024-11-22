import { Button } from '#app/components/ui/button.tsx'
import { Form } from '@remix-run/react'
import { Loader2 } from 'lucide-react'

export const ROUTE_PATH = '/onboarding/practice'

export default function OnboardingPracticeDetails() {
  return (
    <>
      <Button variant="outline" size="sm" className="mt-4">
        Previous
      </Button>
      <Form></Form>
    </>
  )
}
