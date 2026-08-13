export type RouterTransitionArgs = [href: string, navigationType: string]
type RouterTransitionCapture = (...args: RouterTransitionArgs) => void

interface RouterTransitionBridge {
  capture?: RouterTransitionCapture
  queue?: RouterTransitionArgs[]
}

const bridge = globalThis as typeof globalThis & {
  __nlSentryRouterTransitionBridge?: RouterTransitionBridge
}

const getBridge = (): RouterTransitionBridge => (bridge.__nlSentryRouterTransitionBridge ??= {})

export function captureRouterTransitionStart(...args: RouterTransitionArgs): void {
  if (process.env.VERCEL_ENV !== 'production') return

  const state = getBridge()
  if (state.capture) {
    state.capture(...args)
    return
  }

  ;(state.queue ??= []).push(args)
}

export function registerRouterTransitionCapture(capture: RouterTransitionCapture): void {
  const state = getBridge()
  state.capture = capture

  for (const args of state.queue ?? []) capture(...args)
  state.queue = []
}
