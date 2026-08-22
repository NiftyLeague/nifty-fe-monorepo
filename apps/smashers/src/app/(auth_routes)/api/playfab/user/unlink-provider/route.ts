import { NextResponse } from 'next/server'
import { UnlinkProvider } from '@nl/playfab/api/client'
import { errorResHandler } from '@nl/playfab/utils/errorHandlers'
import type { User } from '@nl/playfab/types'

import { withUserRoute } from '@/utils/session'

export const POST = withUserRoute(async (request, session) => {
  const { provider } = await request.json()
  const { SessionTicket } = session.user as User
  if (SessionTicket) {
    try {
      const data = await UnlinkProvider(provider, SessionTicket)
      return NextResponse.json(data)
    } catch (error) {
      const { status, message } = errorResHandler(error)
      return NextResponse.json({ message: message || 'Unlink provider failed' }, { status })
    }
  }
  return NextResponse.json({ message: 'Missing SessionTicket' }, { status: 401 })
})
