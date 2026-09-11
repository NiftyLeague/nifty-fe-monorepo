import type { APIRoute } from 'astro'

import { UnlinkWallet } from '@nl/playfab/api/cloudscript'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  const body = await context.request.json().catch(() => ({}))
  const { address, chain } = body as { address?: string; chain?: string }

  const user = session.user
  const EntityToken = user?.EntityToken?.EntityToken
  const SessionTicket = user?.SessionTicket

  if (!EntityToken || !SessionTicket) {
    return json({ message: 'Missing EntityToken or SessionTicket' }, { status: 401 })
  }
  if (!address) {
    return json({ message: 'Missing wallet address' }, { status: 400 })
  }

  try {
    const data = await UnlinkWallet({ address, chain, EntityToken, SessionTicket })
    return json(data)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Unlink wallet failed' }, { status })
  }
}
