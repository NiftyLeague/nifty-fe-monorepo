export type GoogleTagManagerEvent = Record<string, unknown>

interface WindowWithDataLayer extends Window {
  dataLayer?: GoogleTagManagerEvent[]
}

export const pushToDataLayer = (event: GoogleTagManagerEvent) => {
  if (typeof window === 'undefined') return

  const gtmWindow = window as WindowWithDataLayer
  const dataLayer = (gtmWindow.dataLayer ??= [])
  dataLayer.push(event)
}
