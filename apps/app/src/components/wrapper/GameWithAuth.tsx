import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { usePathname } from '@/runtime/navigation'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { Unity, useUnityContext } from '@/runtime/unity'
import type { UnityConfig } from '@/runtime/unity'
import { Button } from '@nl/ui/base/button'
import { useAccount } from '@/runtime/wagmi'

import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import { ErrorBoundary } from '@nl/ui/custom/error-boundry'
import { Preloader } from '@nl/ui/custom/preloader'
import { NETWORK_NAME, TARGET_NETWORK } from '@/constants/networks'
import { getGameViewedAnalyticsContentId } from '@/constants/games'
import { DEBUG } from '@/constants/index'
import { SUBGRAPH_VERSION } from '@/runtime/env'
import withVerification from '@/components/wrapper/Authentication'
import useAuth from '@/hooks/useAuth'
import { setCanvasInteraction } from '@/utils/canvas-interaction'

interface GameProps {
  unityConfig: UnityConfig
}

interface CustomEventWithCallback<T> extends CustomEvent {
  detail: { callback: (data: T) => void }
}

const getConfiguration = (e: CustomEventWithCallback<string>) => {
  const networkName = NETWORK_NAME[TARGET_NETWORK.chainId]
  const version = SUBGRAPH_VERSION
  if (DEBUG) console.log(`${networkName},${version ?? ''}`)
  setTimeout(() => e.detail.callback(`${networkName},${version ?? ''}`), 1000)
}

const enableGameInteraction = () => {
  if (setCanvasInteraction('game-canvas', true)) {
    // The canvas remains interactive after activation. Remove the global
    // listener so game pages do not keep doing a DOM lookup on every move.
    document.removeEventListener('mousemove', enableGameInteraction)
  }
}

const handleLoaded = () => {
  if (DEBUG) console.log('Unity loaded')
}

const handleProgress = (progress: unknown) => {
  // loadingProgression is already 0-1, progress param is also 0-1
  if (DEBUG && typeof progress === 'number') console.log(`Unity progress: ${progress * 100}%`)
}

const Game = (props: GameProps) => {
  const auth = useAuth()
  const pathname = usePathname()
  const account = useAccount()
  const authMsg = () => `true,${account.address || '0x0'},Vitalik,${auth.authToken}`
  let authCallback: ((authMsg: string) => void) | null = null
  const [unityError, setUnityError] = createSignal<Error | null>(null)

  const unity = useUnityContext(props.unityConfig)
  const {
    isLoaded,
    loadingProgression,
    sendMessage,
    requestFullscreen,
    addEventListener,
    removeEventListener,
  } = unity

  createEffect(() => {
    if (account.address?.length && authCallback) {
      authCallback(authMsg())
    }
  })

  createEffect(() => {
    const contentId = getGameViewedAnalyticsContentId(pathname())
    if (contentId) {
      gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, { content_type: 'game', content_id: contentId })
    }
  })

  const startAuthentication = (e: CustomEventWithCallback<string>) => {
    if (DEBUG) console.log('Authenticating:', authMsg())
    e.detail.callback(authMsg())
    authCallback = e.detail.callback
  }

  const handleError = (error: unknown) => {
    const message = typeof error === 'string' ? error : 'Unity loading error'
    setUnityError(new Error(message))
  }

  onMount(() => {
    // Bridge sendMessage to window.unityInstance for external callers (Unity C# -> JS)
    window.unityInstance = {
      SendMessage: (gameObjectName, methodName, parameter) =>
        sendMessage(gameObjectName, methodName, parameter),
      removeAllEventListeners: () => {
        removeEventListener('loaded', handleLoaded)
        removeEventListener('error', handleError)
        removeEventListener('progress', handleProgress)
      },
      setFullscreen: requestFullscreen,
    }

    addEventListener('loaded', handleLoaded)
    addEventListener('error', handleError)
    addEventListener('progress', handleProgress)
    window.addEventListener('StartAuthentication', startAuthentication as EventListener)
    window.addEventListener('GetConfiguration', getConfiguration as EventListener)
    document.addEventListener('mousemove', enableGameInteraction, { passive: true })

    onCleanup(() => {
      window.unityInstance?.removeAllEventListeners()
      window.removeEventListener('StartAuthentication', startAuthentication as EventListener)
      window.removeEventListener('GetConfiguration', getConfiguration as EventListener)
      document.removeEventListener('mousemove', enableGameInteraction)
    })
  })

  const handleOnClickFullscreen = () => {
    requestFullscreen(true)
  }

  return (
    <div class="relative">
      {/* Surfacing a thrown error inside a tracked scope lets the surrounding
          ErrorBoundary catch async Unity failures, matching the React throw. */}
      {(() => {
        const error = unityError()
        if (error) throw error
        return null
      })()}
      <Preloader ready={isLoaded()} progress={loadingProgression() * 100} label="Loading game" />
      <div class="flex flex-row items-start">
        <div class="flex flex-col items-start">
          <Unity
            unityProvider={unity}
            class={`game-canvas w-(--canvas-w) h-(--canvas-h) ${isLoaded() ? 'visible' : 'invisible'}`}
            style={{ '--canvas-w': 'calc(77vh * 1.33)', '--canvas-h': '77vh' }}
          />
          <Button variant="default" size="lg" onClick={handleOnClickFullscreen} class="mt-1.5">
            Fullscreen
          </Button>
        </div>
      </div>
    </div>
  )
}

const GameWithAuth = withVerification((props: GameProps) => {
  const { isOpera, browserName } = useUserAgent()
  return (
    <Show
      when={!isOpera}
      fallback={<h2 class="mt-8 text-center">{browserName} Browser Not Supported</h2>}
    >
      <ErrorBoundary>
        <Game {...props} />
      </ErrorBoundary>
    </Show>
  )
})

export default GameWithAuth
