import type { APIRoute } from 'astro'

import { RegisterPlayFabUser, GenerateCustomID } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  const body = await context.request.json().catch(() => ({}))
  const { email, password, rememberMe } = body as {
    email?: string
    password?: string
    rememberMe?: boolean
  }

  try {
    const params = { Email: email as string, Password: password as string }
    const loginData = await RegisterPlayFabUser(params)
    const { EntityToken, SessionTicket, PlayFabId } = loginData
    if (SessionTicket) {
      // Generate & link a CustomID for new PlayFab user
      const CustomId = await GenerateCustomID(SessionTicket)
      const user: User = {
        isLoggedIn: true,
        persistLogin: rememberMe,
        CustomId,
        EntityToken,
        PlayFabId,
        SessionTicket,
      }

      session.user = user
      await session.save()

      return json(user)
    }
    return json({ message: 'Signup failed' }, { status: 400 })
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Signup failed' }, { status })
  }
}
