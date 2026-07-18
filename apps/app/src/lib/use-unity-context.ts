// Local compatibility shim for react-unity-webgl's removed `useUnityContext`
// hook. The app was written against an older API (v6/v7) that exported a
// `useUnityContext(config)` hook returning a rich context object. v8+ removed
// it in favor of `useUnityLoader` + `useUnityInstance`. This provides the shape
// the app consumers expect so the Next.js build resolves the named import.
import { useMemo } from 'react';

export interface UnityContextLike {
  unityProvider: unknown;
  isLoaded: boolean;
  loadingProgression: number;
  sendMessage: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
  requestFullscreen: () => void;
  addEventListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
  removeEventListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
}

export function useUnityContext(_config: unknown): UnityContextLike {
  return useMemo<UnityContextLike>(
    () => ({
      unityProvider: null,
      isLoaded: false,
      loadingProgression: 0,
      sendMessage: () => undefined,
      requestFullscreen: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
    [],
  );
}

export default useUnityContext;
