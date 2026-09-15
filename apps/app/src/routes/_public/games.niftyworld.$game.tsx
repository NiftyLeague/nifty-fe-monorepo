import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/_public/games/niftyworld/$game')({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/games/${encodeURIComponent(params.game)}`,
      replace: true,
    })
  },
})
