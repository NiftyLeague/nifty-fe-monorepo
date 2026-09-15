import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/_public/games/wen-game')({
  beforeLoad: () => {
    throw redirect({ href: '/games/wen-2d', replace: true })
  },
})
