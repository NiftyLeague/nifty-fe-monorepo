import type { JSX } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': JSX.HTMLAttributes<HTMLElement> & {
        'auto-rotate-delay'?: string
        'auto-rotate'?: string
        'camera-controls'?: string
        'disable-tap'?: string
        'interaction-prompt-threshold'?: string
        'interaction-prompt'?: string
        'shadow-intensity'?: string
        'shadow-softness'?: string
        'touch-action'?: string
        alt?: string
        exposure?: string
        id?: string
        loading?: string
        src?: string
        style?: JSX.CSSProperties
      }
    }
  }
}
