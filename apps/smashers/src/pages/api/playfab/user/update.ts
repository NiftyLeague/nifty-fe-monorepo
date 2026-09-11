import type { APIRoute } from 'astro'

import { AddOrUpdateContactEmail, UpdateAvatarUrl } from '@nl/playfab/api/client'
import { ChangeDisplayName } from '@nl/playfab/api/cloudscript'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)

  if (!session.user?.isLoggedIn) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await context.request.json().catch(() => ({}))
  const { email, displayName, avatar_url } = body as {
    email?: string
    displayName?: string
    avatar_url?: string
  }

  const user = session.user as User
  const EntityToken = user.EntityToken?.EntityToken
  const SessionTicket = user.SessionTicket

  try {
    let result = {}
    // Update Account Display Name
    if (displayName && EntityToken) result = await ChangeDisplayName(displayName, EntityToken)
    // Update Profile Contact Email
    if (email && SessionTicket) result = await AddOrUpdateContactEmail(email, SessionTicket)
    // Update Profile Avatar
    if (avatar_url && SessionTicket) result = await UpdateAvatarUrl(avatar_url, SessionTicket)

    return json(result)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Update user failed' }, { status })
  }
}
