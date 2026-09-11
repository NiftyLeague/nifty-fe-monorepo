import type { APIRoute } from 'astro'

import { SendAccountRecoveryEmail } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'

import { json } from '@/utils/session'

export const POST: APIRoute = async (context) => {
  const body = await context.request.json().catch(() => ({}))
  const { email } = body as { email?: string }

  if (!email) {
    return json({ message: 'Email is required' }, { status: 400 })
  }
  try {
    const data = await SendAccountRecoveryEmail(email)
    return json(data)
  } catch (error) {
    const { status, message } = errorResHandler(error)
    return json({ message: message || 'Forgot password failed' }, { status })
  }
}
