import { createFileRoute } from '@tanstack/solid-router'

import VerificationRouteBoundary from '@/pages/verification/VerificationRouteBoundary'

export const Route = createFileRoute('/verification/')({
  component: VerificationRouteBoundary,
})
