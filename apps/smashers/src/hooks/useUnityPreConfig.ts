import { useEffect } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const smashersBaseUrl = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_URL as string;
const smashersBuildVersion = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_VERSION as string;

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false';

const loaderUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.loader.js`;
const dataUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.data${useCompressed ? '.br' : ''}`;
const frameworkUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.framework.js${useCompressed ? '.br' : ''}`;
const codeUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.wasm${useCompressed ? '.br' : ''}`;

interface UnityInstance {
  SendMessage: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
}

interface ExtendedUnityContext {
  UNSAFE__unityInstance: UnityInstance;
  sendMessage: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
}

declare global {
  interface Window {
    unityInstance: UnityInstance | null;
  }
}

const useUnityPreConfig = () => {
  const unity = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
    streamingAssetsUrl: `${smashersBaseUrl}/StreamingAssets`,
    companyName: 'NiftyLeague',
    productName: 'NiftySmashers',
    productVersion: smashersBuildVersion,
  });

  useEffect(() => {
    if (unity) {
      const extendedUnity = unity as unknown as ExtendedUnityContext;
      window.unityInstance = {
        SendMessage: extendedUnity.sendMessage,
      };
    }
    return () => {
      window.unityInstance = null;
    };
  }, [unity]);

  return unity;
};

export default useUnityPreConfig;
