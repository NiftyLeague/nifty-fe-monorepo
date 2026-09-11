import type { APIRoute } from 'astro'

import { USER_INITIAL_STATE } from '@nl/playfab/constants'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  session.destroy()
  return json(USER_INITIAL_STATE)
}
