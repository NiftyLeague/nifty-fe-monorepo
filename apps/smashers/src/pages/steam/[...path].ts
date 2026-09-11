import type { APIRoute } from 'astro'

import { deepLinkResponse } from '@/runtime/deep-link'

/** App store deep link consumed by Unity games, campaigns and the invite flow. */
export const GET: APIRoute = (context) => deepLinkResponse(context, { country: true })
