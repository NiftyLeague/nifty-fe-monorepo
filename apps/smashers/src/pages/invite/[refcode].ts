import type { APIRoute } from 'astro'

import { deepLinkResponse } from '@/runtime/deep-link'

/**
 * Referral deep link (invite/<ref_code>): mobile visitors go to the matching
 * app store with the referral attached, everyone else lands on the site with
 * the referral preserved so it is never dropped.
 */
export const GET: APIRoute = (context) => deepLinkResponse(context, { userAgent: true })
