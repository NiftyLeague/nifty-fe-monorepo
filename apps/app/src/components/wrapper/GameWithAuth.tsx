'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUserAgent } from '@nl/ui/hooks/useUserAgent'
import { Unity, useUnityContext } from 'react-unity-webgl'
import type { UnityConfig } from 'react-unity-webgl'
import { Button } from '@nl/ui/base/button'
import { useAccount } from 'wagmi'

import { gtm, GTM_EVENTS } from '@nl/ui/gtm'
import { ErrorBoundary } from '@nl/ui/custom/error-boundry'
import { Preloader } from '@nl/ui/custom/preloader'
import useTokensBalances from '@/hooks/balances/useTokensBalances'
import { NETWORK_NAME, TARGET_NETWORK } from '@/constants/networks'
import { getGameViewedAnalyticsContentId } from '@/constants/games'
import { DEBUG } from '@/constants/index'
import withVerification from '@/components/wrapper/Authentication'
import ArcadeTokensRequired from '@/components/ArcadeTokensRequired'
import useAuth from '@/hooks/useAuth'

interface GameProps {
  unityConfig: UnityConfig
  arcadeTokenRequired?: boolean
}

interface CustomEventWithCallback<T> extends CustomEvent {
  detail: { callback: (data: T) => void }
}

const Game = ({ unityConfig, arcadeTokenRequired = false }: GameProps) => {
  const { authToken } = useAuth()
  const pathname = usePathname()
  const { address } = useAccount()
  const { tokensBalances, loadingArcadeBal, refetchArcadeBal } = useTokensBalances()
  const authMsg = `true,${address || '0x0'},Vitalik,${authToken}`
  const authCallback = useRef<null | ((authMsg: string) => void)>(null)
  const [unityError, setUnityError] = useState<Error | null>(null)

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

  useEffect(() => {
    if (address?.length && authCallback.current) {
      authCallback.current(authMsg)
    }
  }, [address, authMsg])

  useEffect(() => {
    const contentId = getGameViewedAnalyticsContentId(pathname)
    if (contentId) {
      gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, { content_type: 'game', content_id: contentId })
    }
  }, [pathname])

  const startAuthentication = useCallback(
    (e: CustomEventWithCallback<string>) => {
      if (DEBUG) console.log('Authenticating:', authMsg)
      e.detail.callback(authMsg)
      authCallback.current = e.detail.callback
    },
    [authMsg]
  )

  const getConfiguration = useCallback((e: CustomEventWithCallback<string>) => {
    const networkName = NETWORK_NAME[TARGET_NETWORK.chainId]
    const version = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION
    if (DEBUG) console.log(`${networkName},${version ?? ''}`)
    setTimeout(() => e.detail.callback(`${networkName},${version ?? ''}`), 1000)
  }, [])

  const onMouse = useCallback(() => {
    const content = Array.from(
      document.getElementsByClassName('game-canvas') as HTMLCollectionOf<HTMLElement>
    )[0]
    if (content) {
      content.style.pointerEvents = 'auto'
      content.style.cursor = 'pointer'
    }
  }, [])

  const handleLoaded = useCallback(() => {
    if (DEBUG) console.log('Unity loaded')
  }, [])

  const handleError = useCallback((error: unknown) => {
    const message = typeof error === 'string' ? error : 'Unity loading error'
    setUnityError(new Error(message))
  }, [])

  const handleProgress = useCallback((progress: unknown) => {
    // v10: loadingProgression is already 0-1, progress param is also 0-1
    if (DEBUG && typeof progress === 'number') console.log(`Unity progress: ${progress * 100}%`)
  }, [])

  useEffect(() => {
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
    document.addEventListener('mousemove', onMouse, false)

    return () => {
      window.unityInstance?.removeAllEventListeners()
      window.removeEventListener('StartAuthentication', startAuthentication as EventListener)
      window.removeEventListener('GetConfiguration', getConfiguration as EventListener)
      document.removeEventListener('mousemove', onMouse, false)
    }
  }, [
    sendMessage,
    requestFullscreen,
    addEventListener,
    removeEventListener,
    handleLoaded,
    handleError,
    handleProgress,
    onMouse,
    startAuthentication,
    getConfiguration,
  ])

  const handleOnClickFullscreen = () => {
    requestFullscreen(true)
  }

  if (arcadeTokenRequired && loadingArcadeBal) {
    return <></>
  }

  if (arcadeTokenRequired && Number(tokensBalances.AT) === 0) {
    return <ArcadeTokensRequired refetchArcadeBal={refetchArcadeBal} />
  }

  return (
    <>
      <Preloader ready={isLoaded} progress={loadingProgression * 100} />
      <div className="flex flex-row items-start">
        <div className="flex flex-col items-start">
          <Unity
            key={authToken}
            className="game-canvas"
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
            className="mt-[6px]"
          >
            Fullscreen
          </Button>
        </div>
      </div>
    </>
  )
}

const GameWithAuth = withVerification((props: GameProps) => {
  const { isOpera, browserName } = useUserAgent()
  return isOpera() ? (
    <h2 className="mt-8 text-center">{browserName} Browser Not Supported</h2>
  ) : (
    <ErrorBoundary>
      <Game {...props} />
    </ErrorBoundary>
  )
})

export default GameWithAuth
