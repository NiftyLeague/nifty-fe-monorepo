import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/_public/games/crypto-winter')({
  beforeLoad: () => {
    throw redirect({ href: '/games/degen-dodge', replace: true })
  },
})
