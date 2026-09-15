import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/games/wen-game')({
  beforeLoad: () => {
    throw redirect({ href: '/games/wen-2d', replace: true })
  },
})
