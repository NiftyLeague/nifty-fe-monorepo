import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/failure')({
  loader: () => {
    throw new Error('M2 controlled failure')
  },
  component: () => null,
})
