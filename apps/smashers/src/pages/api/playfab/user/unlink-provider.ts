import type { APIRoute } from 'astro'

import { UnlinkProvider } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  const { SessionTicket } = (session.user ?? {}) as User

  if (!SessionTicket) {
    return json({ message: 'Missing SessionTicket' }, { status: 401 })
  }

  const { provider } = await context.request.json().catch(() => ({}))
  try {
    const data = await UnlinkProvider(provider, SessionTicket)
    return json(data)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Unlink provider failed' }, { status })
  }
}
