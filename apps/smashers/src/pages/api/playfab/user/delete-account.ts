import type { APIRoute } from 'astro'

import { DeletePlayer } from '@nl/playfab/api/admin'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  const { PlayFabId } = (session.user ?? {}) as User

  if (!PlayFabId) {
    return json({ message: 'Missing PlayFabId' }, { status: 400 })
  }

  try {
    const data = await DeletePlayer(PlayFabId)
    session.destroy()
    return json(data)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Delete account failed' }, { status })
  }
}
