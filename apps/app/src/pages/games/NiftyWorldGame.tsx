'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { ExternalIcon } from '@nl/ui/custom/external-icon'

import Link from '@/runtime/Link'
import { getNiftyWorldGameUrl, type NiftyWorldGame } from '@/constants/niftyworld-games'

interface NiftyWorldGameProps {
  game: NiftyWorldGame
}

type GameFrameState = 'loading' | 'ready' | 'error'

const GAME_FRAME_LOAD_TIMEOUT_MS = 10_000
let nextEmbedVisitId = 0

const createEmbedVisitId = () => `${Date.now()}-${++nextEmbedVisitId}`

export default function NiftyWorldGame({ game }: NiftyWorldGameProps) {
  const gameShellRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [embedVisitId, setEmbedVisitId] = useState<string | null>(null)
  const [frameState, setFrameState] = useState<GameFrameState>('loading')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    setIsHydrated(true)
    setEmbedVisitId(createEmbedVisitId())
  }, [])

  useEffect(() => {
    setFrameState('loading')
  }, [game.id, loadAttempt])

  useEffect(() => {
    if (!isHydrated || frameState !== 'loading') return

    const timeoutId = window.setTimeout(() => {
      if (loadAttempt === 0) {
        setLoadAttempt(1)
      } else {
        setFrameState('error')
      }
    }, GAME_FRAME_LOAD_TIMEOUT_MS)

    return () => window.clearTimeout(timeoutId)
  }, [frameState, isHydrated, loadAttempt])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === gameShellRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleToggleFullscreen = () => {
    const gameShell = gameShellRef.current
    if (!gameShell) return

    if (document.fullscreenElement === gameShell) {
      void document.exitFullscreen().catch(() => undefined)
      return
    }

    void gameShell.requestFullscreen().catch(() => undefined)
  }

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Nifty League mini game</p>
          <h1 className="text-2xl font-normal font-subheader tracking-subheader">{game.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/games" prefetch={false} className={buttonVariants({ variant: 'outline' })}>
            <ArrowLeft aria-hidden="true" />
            <span>Back to games</span>
          </Link>
          <a
            href={getNiftyWorldGameUrl(game)}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            Open in new tab <ExternalIcon />
          </a>
        </div>
      </div>

      <div
        ref={gameShellRef}
        className={
          isFullscreen
            ? 'relative h-screen w-screen min-h-0 flex-1 overflow-hidden rounded-none border-0 bg-black'
            : 'relative min-h-[520px] flex-1 overflow-hidden rounded-md border bg-black lg:h-[calc(100dvh-190px)]'
        }
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute right-3 top-3 z-10 bg-black/70 text-white hover:bg-black/85 hover:text-white"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          <span>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
        </Button>
        {frameState === 'loading' && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 p-6 text-center text-sm text-white"
            role="status"
            aria-live="polite"
            aria-label={`Loading ${game.title}`}
          >
            Loading {game.title}…
          </div>
        )}
        {frameState === 'error' && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/95 p-6 text-center text-white"
            role="alert"
          >
            <p>Could not load {game.title}.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setLoadAttempt((attempt) => attempt + 1)
                setFrameState('loading')
              }}
            >
              Reload {game.title}
            </Button>
          </div>
        )}
        {isHydrated && embedVisitId && (
          <iframe
            key={`${game.id}-${loadAttempt}`}
            src={getNiftyWorldGameUrl(game, true, loadAttempt, embedVisitId)}
            title={`${game.title} mini game`}
            className="h-full min-h-[520px] w-full border-0"
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setFrameState('ready')}
            onError={() => setFrameState('error')}
          />
        )}
      </div>
    </div>
  )
}
