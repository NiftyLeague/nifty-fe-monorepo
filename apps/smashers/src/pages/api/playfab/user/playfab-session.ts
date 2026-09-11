import type { APIRoute } from 'astro'

import { USER_INITIAL_STATE } from '@nl/playfab/constants'
import { IsClientLoggedIn } from '@nl/playfab/sdk/client'

import { getSession, json } from '@/utils/session'

export const GET: APIRoute = async (context) => {
  const session = await getSession(context)
  const user = session.user
  const isLoggedIn = user ? IsClientLoggedIn(user) : false
  if (user?.PlayFabId) {
    user.isLoggedIn = isLoggedIn
    await session.save()
    return json({ ...user, isLoggedIn })
  }
  return json(USER_INITIAL_STATE)
}
