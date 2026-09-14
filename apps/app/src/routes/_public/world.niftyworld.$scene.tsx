import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/world/niftyworld/$scene')({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/world/${encodeURIComponent(params.scene)}`,
      replace: true,
    })
  },
})
