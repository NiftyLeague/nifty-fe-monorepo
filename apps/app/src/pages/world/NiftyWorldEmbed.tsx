'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { Preloader } from '@nl/ui/custom/preloader'

import { NIFTY_WORLD_ORIGIN } from '@/constants/niftyworld-games'
import Link from '@/runtime/Link'

interface NiftyWorldEmbedProps {
  title: string
  eyebrow: string
  backHref: string
  backLabel: string
  frameTitle: string
  canonicalUrl: string
  getEmbedUrl: (attempt: number, visitId: string) => string
}

type FrameState = 'loading' | 'ready' | 'error'

const FRAME_LOAD_TIMEOUT_MS = 30_000
const NIFTY_WORLD_THEME_MESSAGE = 'niftyworld:theme'
const NIFTY_WORLD_THEME_READY_MESSAGE = 'niftyworld:theme-ready'
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
let nextEmbedVisitId = 0

const createEmbedVisitId = () => `${Date.now()}-${++nextEmbedVisitId}`

export default function NiftyWorldEmbed({
  title,
  eyebrow,
  backHref,
  backLabel,
  frameTitle,
  canonicalUrl,
  getEmbedUrl,
}: NiftyWorldEmbedProps) {
  const experienceShellRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [embedVisitId, setEmbedVisitId] = useState<string | null>(null)
  const [frameState, setFrameState] = useState<FrameState>('loading')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    setIsHydrated(true)
    setEmbedVisitId(createEmbedVisitId())
  }, [])

  useEffect(() => {
    setFrameState('loading')
  }, [loadAttempt])

  useEffect(() => {
    if (!isHydrated || frameState !== 'loading') return

    const timeoutId = window.setTimeout(() => {
      if (loadAttempt === 0) {
        setLoadAttempt(1)
      } else {
        setFrameState('error')
      }
    }, FRAME_LOAD_TIMEOUT_MS)

    return () => window.clearTimeout(timeoutId)
  }, [frameState, isHydrated, loadAttempt])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === experienceShellRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useIsomorphicLayoutEffect(() => {
    const handleThemeReady = (event: MessageEvent) => {
      if (event.origin !== NIFTY_WORLD_ORIGIN) return
      if (event.source !== frameRef.current?.contentWindow) return
      if (!event.data || typeof event.data !== 'object') return
      if (event.data.type !== NIFTY_WORLD_THEME_READY_MESSAGE) return

      frameRef.current?.contentWindow?.postMessage(
        {
          type: NIFTY_WORLD_THEME_MESSAGE,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        },
        NIFTY_WORLD_ORIGIN
      )
    }

    window.addEventListener('message', handleThemeReady)
    return () => window.removeEventListener('message', handleThemeReady)
  }, [])

  useEffect(() => {
    if (frameState !== 'ready') return

    const sendThemeNotice = () => {
      frameRef.current?.contentWindow?.postMessage(
        {
          type: NIFTY_WORLD_THEME_MESSAGE,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        },
        NIFTY_WORLD_ORIGIN
      )
    }

    sendThemeNotice()

    const themeObserver = new MutationObserver(sendThemeNotice)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => themeObserver.disconnect()
  }, [frameState])

  const handleToggleFullscreen = () => {
    const experienceShell = experienceShellRef.current
    if (!experienceShell) return

    if (document.fullscreenElement === experienceShell) {
      void document.exitFullscreen().catch(() => undefined)
      return
    }

    void experienceShell.requestFullscreen().catch(() => undefined)
  }

  const handleFrameLoad = () => {
    setFrameState('ready')
    frameRef.current?.focus()
    frameRef.current?.contentWindow?.postMessage(
      {
        type: NIFTY_WORLD_THEME_MESSAGE,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
      NIFTY_WORLD_ORIGIN
    )
  }

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
          <h1 className="text-2xl font-normal font-subheader tracking-subheader">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Anchor buttons inherit the primary link color, which lands just
                under the 4.5:1 axe bar on the outline surface. */}
          <Link
            href={backHref}
            prefetch={false}
            className={buttonVariants({ variant: 'outline' }) + ' text-foreground'}
          >
            <ArrowLeft aria-hidden="true" />
            <span>{backLabel}</span>
          </Link>
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' }) + ' text-foreground'}
          >
            Open in new tab <ExternalIcon />
          </a>
        </div>
      </div>

      <div
        ref={experienceShellRef}
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
        <Preloader ready={frameState !== 'loading'} progress={0} label={`Loading ${title}`} />
        {frameState === 'error' && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/95 p-6 text-center text-white"
            role="alert"
          >
            <p>Could not load {title}.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setLoadAttempt((attempt) => attempt + 1)
                setFrameState('loading')
              }}
            >
              Reload {title}
            </Button>
          </div>
        )}
        {isHydrated && embedVisitId && (
          <iframe
            key={`${frameTitle}-${loadAttempt}`}
            ref={frameRef}
            src={getEmbedUrl(loadAttempt, embedVisitId)}
            title={frameTitle}
            className="h-full min-h-[520px] w-full border-0"
            tabIndex={0}
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={handleFrameLoad}
            onError={() => setFrameState('error')}
          />
        )}
      </div>
    </div>
  )
}
