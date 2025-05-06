import { BrowserProvider, Provider } from 'ethers6';

import { UnityContext } from 'react-unity-webgl';
import type { Ethereumish } from '@/types/web3';

interface UnityInstance extends UnityContext {
  SendMessage?: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
}

interface UnityParameters {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl?: string;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  devicePixelRatio?: number;
  showBanner?: (msg: string, type: 'error' | 'warning' | 'info' | 'success') => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    createUnityInstance: (
      canvasHtmlElement: HTMLCanvasElement,
      parameters: UnityParameters,
      onProgress?: (progression: number) => void,
    ) => Promise<UnityInstance>;
    ethereum?: Ethereumish;
    ReactUnityWebGL: {
      canvas: () => void;
      error: () => void;
      loaded: () => void;
      [eventName: string]: () => void;
    };
    unityInstance: UnityInstance | null;
    Web3?: {
      providers?: {
        HttpProvider?: BrowserProvider;
        IpcProvider?: Provider;
      };
    };
  }
}
