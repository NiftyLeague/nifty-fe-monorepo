'use client'

import { createEffect, createSignal } from 'solid-js'
import { usePathname } from '@/runtime/navigation'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { Unity, useUnityContext } from 'react-unity-webgl'
import type { UnityConfig } from 'react-unity-webgl'
import { Button } from '@nl/ui/base/button'
import { useAccount } from 'wagmi'

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

const Game = ({ unityConfig }: GameProps) => {
  const { authToken } = useAuth()
  const pathname = usePathname()
  const { address } = useAccount()
  const authMsg = `true,${address || '0x0'},Vitalik,${authToken}`
  const authCallback = useRef<null | ((authMsg: string) => void)>(null)
  const [unityError, setUnityError] = createSignal<Error | null>(null)

  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    sendMessage,
    requestFullscreen,
    addEventListener,
    removeEventListener,
  } = useUnityContext(unityConfig)

  // Conditionally throw errors to be caught by the ErrorBoundary
  if (unityError) throw unityError

  createEffect(() => {
    if (address?.length && authCallback.current) {
      authCallback.current(authMsg)
    }
  }, [address, authMsg])

  createEffect(() => {
    const contentId = getGameViewedAnalyticsContentId(pathname)
    if (contentId) {
      gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, { content_type: 'game', content_id: contentId })
    }
  }, [pathname])

  const startAuthentication = (
    (e: CustomEventWithCallback<string>) => {
      if (DEBUG) console.log('Authenticating:', authMsg)
      e.detail.callback(authMsg)
      authCallback.current = e.detail.callback
    },
    [authMsg]
  )

  const getConfiguration = ((e: CustomEventWithCallback<string>) => {
    const networkName = NETWORK_NAME[TARGET_NETWORK.chainId]
    const version = SUBGRAPH_VERSION
    if (DEBUG) console.log(`${networkName},${version ?? ''}`)
    setTimeout(() => e.detail.callback(`${networkName},${version ?? ''}`), 1000)
  }, [])

  const enableGameInteraction = (function enableGameInteraction() {
    if (setCanvasInteraction('game-canvas', true)) {
      // The canvas remains interactive after activation. Remove the global
      // listener so game pages do not keep doing a DOM lookup on every move.
      document.removeEventListener('mousemove', enableGameInteraction)
    }
  }, [])

  const handleLoaded = (() => {
    if (DEBUG) console.log('Unity loaded')
  }, [])

  const handleError = ((error: unknown) => {
    const message = typeof error === 'string' ? error : 'Unity loading error'
    setUnityError(new Error(message))
  }, [])

  const handleProgress = ((progress: unknown) => {
    // v10: loadingProgression is already 0-1, progress param is also 0-1
    if (DEBUG && typeof progress === 'number') console.log(`Unity progress: ${progress * 100}%`)
  }, [])

  createEffect(() => {
    // Bridge sendMessage to window.unityInstance for external callers (Unity C# -> JS)
    window.unityInstance = {
      SendMessage: (...args) => sendMessage(...args),
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

    return () => {
      window.unityInstance?.removeAllEventListeners()
      window.removeEventListener('StartAuthentication', startAuthentication as EventListener)
      window.removeEventListener('GetConfiguration', getConfiguration as EventListener)
      document.removeEventListener('mousemove', enableGameInteraction)
    }
  }, [
    sendMessage,
    requestFullscreen,
    addEventListener,
    removeEventListener,
    handleLoaded,
    handleError,
    handleProgress,
    enableGameInteraction,
    startAuthentication,
    getConfiguration,
  ])

  const handleOnClickFullscreen = () => {
    requestFullscreen(true)
  }

  return (
    <div class="relative">
      <Preloader ready={isLoaded} progress={loadingProgression * 100} label="Loading game" />
      <div class="flex flex-row items-start">
        <div class="flex flex-col items-start">
          <Unity            
            class="game-canvas"
            unityProvider={unityProvider}
            style={{
              width: 'calc(77vh * 1.33)',
              height: '77vh',
              visibility: isLoaded ? 'visible' : 'hidden',
            }}
          />
          <Button
            variant="default"
            size="lg"
            onClick={handleOnClickFullscreen}
            class="mt-[6px]"
          >
            Fullscreen
          </Button>
        </div>
      </div>
    </div>
  )
}

const GameWithAuth = withVerification((props: GameProps) => {
  const { isOpera, browserName } = useUserAgent()
  return isOpera() ? (
    <h2 class="mt-8 text-center">{browserName} Browser Not Supported</h2>
  ) : (
    <ErrorBoundary>
      <Game {...props} />
    </ErrorBoundary>
  )
})

export default GameWithAuth
