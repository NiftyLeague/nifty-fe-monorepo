import { createFileRoute } from '@tanstack/react-router'

import VerificationRouteBoundary from '@/pages/verification/VerificationRouteBoundary'

export const Route = createFileRoute('/verification/')({
  component: VerificationRouteBoundary,
})
