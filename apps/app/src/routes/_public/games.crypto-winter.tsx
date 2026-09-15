import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/games/crypto-winter')({
  beforeLoad: () => {
    throw redirect({ href: '/games/degen-dodge', replace: true })
  },
})
