import { createFileRoute, redirect } from '@tanstack/react-router'

import { LEGGIES } from '@/constants/degens'
import { DEGEN_IMAGE_ORIGIN, degenShareMeta } from '@/runtime/metadata'

export const Route = createFileRoute('/_public/degens/$id')({
  // Deep links to a single DEGEN land on the filtered catalog. The token id is
  // carried through as a search param the catalog already understands.
  //
  // A literal `href` is used rather than `search`, because the router's default
  // serializer JSON-quotes number-like strings (`tokenId=101` -> `tokenId="101"`).
  // The previous router produced the unquoted form, and
  // shared links in that shape must keep working.
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/degens?tokenId=${encodeURIComponent(params.id)}`, replace: true })
  },
  head: ({ params }) => {
    const fileType = LEGGIES.includes(Number(params.id)) ? 'gif' : 'webp'

    return {
      meta: degenShareMeta(
        params.id,
        `${DEGEN_IMAGE_ORIGIN}/img/degens/nfts/${params.id}.${fileType}`
      ),
    }
  },
})
