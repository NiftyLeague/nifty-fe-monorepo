'use client'

import type { PropsWithChildren } from 'react'
import { UserContextProvider } from '@nl/playfab/components/UserContextProvider'

/**
 * PlayFab session context only. The NextAuth SessionProvider that used to wrap
 * this is gone: the OAuth session is now linked to the PlayFab account
 * server-side in the callback route, so the client never holds a provider token.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  return <UserContextProvider>{children}</UserContextProvider>
}

export default AuthProvider
