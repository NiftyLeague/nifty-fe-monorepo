import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/games/niftyworld/$game')({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/games/${encodeURIComponent(params.game)}`,
      replace: true,
    })
  },
})
