import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/_public/world/niftyworld/$scene')({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/world/${encodeURIComponent(params.scene)}`,
      replace: true,
    })
  },
})
