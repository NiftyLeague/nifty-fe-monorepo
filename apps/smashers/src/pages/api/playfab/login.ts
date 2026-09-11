import type { APIRoute } from 'astro'

import { LoginWithEmailAddress, LoginWithCustomID } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { getSession, json } from '@/utils/session'

const InfoRequestParameters = {
  GetUserAccountInfo: true,
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams

export const POST: APIRoute = async (context) => {
  const session = await getSession(context)
  const body = await context.request.json().catch(() => ({}))
  const { email, password, rememberMe, CustomId } = body as {
    email?: string
    password?: string
    rememberMe?: boolean
    CustomId?: string
  }

  try {
    const loginData = CustomId
      ? await LoginWithCustomID({ CustomId })
      : await LoginWithEmailAddress({
          Email: email as string,
          Password: password as string,
          InfoRequestParameters,
        })

    const { EntityToken, SessionTicket, PlayFabId, InfoResultPayload } = loginData
    const timestamp = new Date().toISOString()
    const user: User = {
      isLoggedIn: true,
      persistLogin: rememberMe ?? session.user?.persistLogin,
      EntityToken,
      PlayFabId,
      SessionTicket,
      CustomId: CustomId ?? InfoResultPayload?.AccountInfo?.CustomIdInfo?.CustomId,
      lastLogin: timestamp,
    }

    session.user = user
    await session.save()

    return json(user)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Login failed' }, { status })
  }
}
