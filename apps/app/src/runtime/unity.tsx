import { createSignal, onCleanup, onMount, splitProps, type JSX } from 'solid-js'

/**
 * Minimal Solid bridge for Unity WebGL builds, replacing react-unity-webgl.
 * Loads the build's `*.loader.js`, instantiates against a canvas, and exposes
 * lifecycle events (`loaded`, `progress`, `error`), `sendMessage`, and
 * `requestFullscreen`.
 */

export interface UnityConfig {
  loaderUrl: string
  dataUrl: string
  frameworkUrl: string
  codeUrl: string
  streamingAssetsUrl?: string
  companyName?: string
  productName?: string
  productVersion?: string
  [key: string]: unknown
}

interface UnityInstance {
  SendMessage: (
    gameObject: string,
    method: string,
    parameter?: string | number | boolean
  ) => void
  SetFullscreen: (fullscreen: number) => void
  Quit: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnityEventCallback = (...args: any[]) => void

const loaderScripts = new Map<string, Promise<void>>()

function ensureLoader(loaderUrl: string): Promise<void> {
  let pending = loaderScripts.get(loaderUrl)
  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      if (typeof window.createUnityInstance === 'function') {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = loaderUrl
      script.onload = () => resolve()
      script.onerror = () => {
        loaderScripts.delete(loaderUrl)
        reject(new Error(`Failed to load Unity loader: ${loaderUrl}`))
      }
      document.head.appendChild(script)
    })
    loaderScripts.set(loaderUrl, pending)
  }
  return pending
}

export interface UnityContext {
  isLoaded: () => boolean
  loadingProgression: () => number
  initialisationError: () => unknown
  sendMessage: (
    gameObject: string,
    method: string,
    parameter?: string | number | boolean
  ) => void
  requestFullscreen: (enabled: boolean) => void
  addEventListener: (event: string, callback: UnityEventCallback) => void
  removeEventListener: (event: string, callback: UnityEventCallback) => void
  /** Internal: binds the canvas element rendered by <Unity />. */
  _bindCanvas: (el: HTMLCanvasElement) => void
  /** Internal: the resolved Unity instance. */
  _instance: () => UnityInstance | undefined
}

export function useUnityContext(config: UnityConfig): UnityContext {
  const [isLoaded, setIsLoaded] = createSignal(false)
  const [loadingProgression, setLoadingProgression] = createSignal(0)
  const [initialisationError, setInitialisationError] = createSignal<unknown>()
  const [instance, setInstance] = createSignal<UnityInstance>()

  let canvas: HTMLCanvasElement | undefined
  const listeners = new Map<string, Set<UnityEventCallback>>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = (event: string, ...args: any[]) => {
    listeners.get(event)?.forEach((callback) => callback(...args))
  }

  onMount(() => {
    let cancelled = false

    void (async () => {
      if (!canvas) return
      await ensureLoader(config.loaderUrl)
      const { loaderUrl: _loaderUrl, ...buildConfig } = config
      const unityInstance = await window.createUnityInstance!(
        canvas,
        buildConfig as UnityConfig,
        (progress) => {
          setLoadingProgression(progress)
          emit('progress', progress)
        }
      )
      if (cancelled) {
        void unityInstance.Quit()
        return
      }
      setInstance(() => unityInstance)
      setIsLoaded(true)
      emit('loaded')
    })().catch((error: unknown) => {
      if (cancelled) return
      setInitialisationError(error)
      emit('error', error)
    })

    onCleanup(() => {
      cancelled = true
      const active = instance()
      setInstance(undefined)
      void active?.Quit().catch(() => {})
    })
  })

  return {
    isLoaded,
    loadingProgression,
    initialisationError,
    sendMessage: (gameObject, method, parameter) => {
      instance()?.SendMessage(gameObject, method, parameter)
    },
    requestFullscreen: (enabled) => {
      instance()?.SetFullscreen(enabled ? 1 : 0)
    },
    addEventListener: (event, callback) => {
      let callbacks = listeners.get(event)
      if (!callbacks) {
        callbacks = new Set()
        listeners.set(event, callbacks)
      }
      callbacks.add(callback)
    },
    removeEventListener: (event, callback) => {
      listeners.get(event)?.delete(callback)
    },
    _bindCanvas: (el) => {
      canvas = el
    },
    _instance: instance,
  }
}

interface UnityProps extends Omit<JSX.HTMLAttributes<HTMLCanvasElement>, 'ref'> {
  unityProvider: UnityContext
}

export function Unity(props: UnityProps) {
  const [local, rest] = splitProps(props, ['unityProvider'])
  return <canvas ref={(el) => local.unityProvider._bindCanvas(el)} {...rest} />
}
