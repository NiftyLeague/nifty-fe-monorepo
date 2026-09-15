import type { ParentComponent } from 'solid-js'
import { UserContextProvider } from '@nl/playfab/components/UserContextProvider'

/**
 * PlayFab session context only. The NextAuth SessionProvider that used to wrap
 * this is gone: the OAuth session is now linked to the PlayFab account
 * server-side in the callback route, so the client never holds a provider token.
 */
export const AuthProvider: ParentComponent = (props) => (
  <UserContextProvider>{props.children}</UserContextProvider>
)

export default AuthProvider
