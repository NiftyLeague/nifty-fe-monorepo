import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-solid'

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
let nextEmbedVisitId = 0

const createEmbedVisitId = () => `${Date.now()}-${++nextEmbedVisitId}`

export default function NiftyWorldEmbed(props: NiftyWorldEmbedProps) {
  const [experienceShell, setExperienceShell] = createSignal<HTMLDivElement>()
  const [frame, setFrame] = createSignal<HTMLIFrameElement>()
  const [isFullscreen, setIsFullscreen] = createSignal(false)
  // A null visit id also gates the iframe to the client: it is only assigned
  // in onMount, so SSR never renders the frame tag.
  const [embedVisitId, setEmbedVisitId] = createSignal<string | null>(null)
  const [frameState, setFrameState] = createSignal<FrameState>('loading')
  const [loadAttempt, setLoadAttempt] = createSignal(0)

  onMount(() => {
    setEmbedVisitId(createEmbedVisitId())
  })

  createEffect(() => {
    loadAttempt()
    setFrameState('loading')
  })

  createEffect(() => {
    if (!embedVisitId() || frameState() !== 'loading') return

    const timeoutId = window.setTimeout(() => {
      if (loadAttempt() === 0) {
        setLoadAttempt(1)
      } else {
        setFrameState('error')
      }
    }, FRAME_LOAD_TIMEOUT_MS)

    onCleanup(() => window.clearTimeout(timeoutId))
  })

  createEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === experienceShell())
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    onCleanup(() => document.removeEventListener('fullscreenchange', handleFullscreenChange))
  })

  onMount(() => {
    const handleThemeReady = (event: MessageEvent) => {
      if (event.origin !== NIFTY_WORLD_ORIGIN) return
      if (event.source !== frame()?.contentWindow) return
      if (!event.data || typeof event.data !== 'object') return
      if (event.data.type !== NIFTY_WORLD_THEME_READY_MESSAGE) return

      frame()?.contentWindow?.postMessage(
        {
          type: NIFTY_WORLD_THEME_MESSAGE,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        },
        NIFTY_WORLD_ORIGIN
      )
    }

    window.addEventListener('message', handleThemeReady)
    onCleanup(() => window.removeEventListener('message', handleThemeReady))
  })

  createEffect(() => {
    if (frameState() !== 'ready') return

    const sendThemeNotice = () => {
      frame()?.contentWindow?.postMessage(
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

    onCleanup(() => themeObserver.disconnect())
  })

  const handleToggleFullscreen = () => {
    if (!experienceShell()) return

    if (document.fullscreenElement === experienceShell()) {
      void document.exitFullscreen().catch(() => undefined)
      return
    }

    void experienceShell()!
      .requestFullscreen()
      .catch(() => undefined)
  }

  const handleFrameLoad = () => {
    setFrameState('ready')
    frame()?.focus()
    frame()?.contentWindow?.postMessage(
      {
        type: NIFTY_WORLD_THEME_MESSAGE,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
      NIFTY_WORLD_ORIGIN
    )
  }

  return (
    <div class="flex min-h-full flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm text-muted-foreground">{props.eyebrow}</p>
          <h1 class="text-2xl font-normal font-subheader tracking-subheader">{props.title}</h1>
        </div>
        <div class="flex flex-wrap gap-2">
          {/* Anchor buttons inherit the primary link color, which lands just
                under the 4.5:1 axe bar on the outline surface. */}
          <Link
            href={props.backHref}
            prefetch={false}
            class={buttonVariants({ variant: 'outline' }) + ' text-foreground'}
          >
            <ArrowLeft aria-hidden="true" />
            <span>{props.backLabel}</span>
          </Link>
          <a
            href={props.canonicalUrl}
            target="_blank"
            rel="noreferrer"
            class={buttonVariants({ variant: 'outline' }) + ' text-foreground'}
          >
            Open in new tab <ExternalIcon />
          </a>
        </div>
      </div>

      <div
        ref={setExperienceShell}
        class={
          isFullscreen()
            ? 'relative h-screen w-screen min-h-0 flex-1 overflow-hidden rounded-none border-0 bg-black'
            : 'relative min-h-130 flex-1 overflow-hidden rounded-md border bg-black lg:h-[calc(100dvh-190px)]'
        }
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="absolute right-3 top-3 z-10 bg-black/70 text-white hover:bg-black/85 hover:text-white"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen() ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          <span>{isFullscreen() ? 'Exit fullscreen' : 'Fullscreen'}</span>
        </Button>
        <Preloader
          ready={frameState() !== 'loading'}
          progress={0}
          label={`Loading ${props.title}`}
        />
        <Show when={frameState() === 'error'}>
          <div
            class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/95 p-6 text-center text-white"
            role="alert"
          >
            <p>Could not load {props.title}.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setLoadAttempt((attempt) => attempt + 1)
                setFrameState('loading')
              }}
            >
              Reload {props.title}
            </Button>
          </div>
        </Show>
        <Show when={embedVisitId()} keyed>
          {(visitId) => (
            <iframe
              ref={setFrame}
              src={props.getEmbedUrl(loadAttempt(), visitId)}
              title={props.frameTitle}
              class="h-full min-h-130 w-full border-0"
              tabIndex={0}
              allow="autoplay; fullscreen; gamepad"
              allowfullscreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={handleFrameLoad}
              onError={() => setFrameState('error')}
            />
          )}
        </Show>
      </div>
    </div>
  )
}
