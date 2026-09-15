import { BrowserProvider, Provider } from 'ethers'

import type { Ethereumish } from '@/types/web3'

type UnityMessageParameter = string | number | boolean | undefined

interface UnityWindowBridge {
  SendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: UnityMessageParameter
  ) => void
  removeAllEventListeners: () => void
  setFullscreen?: (fullscreen: boolean) => void
}

interface UnityInstance {
  SendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: UnityMessageParameter
  ) => void
  SetFullscreen: (fullscreen: number) => void
  Quit: () => Promise<void>
}

interface UnityParameters {
  dataUrl: string
  frameworkUrl: string
  codeUrl?: string
  streamingAssetsUrl?: string
  companyName?: string
  productName?: string
  productVersion?: string
  devicePixelRatio?: number
  showBanner?: (msg: string, type: 'error' | 'warning' | 'info' | 'success') => void
  [key: string]: unknown
}

declare global {
  interface Window {
    createUnityInstance: (
      canvasHtmlElement: HTMLCanvasElement,
      parameters: UnityParameters,
      onProgress?: (progression: number) => void
    ) => Promise<UnityInstance>
    ethereum?: Ethereumish
    ReactUnityWebGL: {
      canvas: () => void
      error: () => void
      loaded: () => void
      [eventName: string]: () => void
    }
    unityInstance: UnityWindowBridge | null
    Web3?: { providers?: { HttpProvider?: BrowserProvider; IpcProvider?: Provider } }
  }
}
