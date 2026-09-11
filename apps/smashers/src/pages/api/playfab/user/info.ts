import type { APIRoute } from 'astro'

import { GetPlayerCombinedInfo, GetUserPublisherData } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import { USER_INFO_INITIAL_STATE } from '@nl/playfab/constants'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

export const GET: APIRoute = async (context) => {
  const session = await getSession(context)
  const { SessionTicket } = (session.user ?? {}) as User

  if (SessionTicket) {
    try {
      const player = await GetPlayerCombinedInfo(SessionTicket)
      const publisherData = await GetUserPublisherData(SessionTicket)
      return json({
        ...USER_INFO_INITIAL_STATE,
        ...(player ? player.InfoResultPayload : {}),
        PublisherData: publisherData,
      })
    } catch (error) {
      const { status, message } = errorResHandler(error)
      return json({ message: message || 'Get user info failed' }, { status })
    }
  }
  return json(USER_INFO_INITIAL_STATE)
}
