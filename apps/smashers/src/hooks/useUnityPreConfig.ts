import { useEffect } from 'react';
import { useUnityContext } from 'react-unity-webgl';

const smashersBaseUrl = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_URL as string;
const smashersBuildVersion = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_VERSION as string;

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false';

const loaderUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.loader.js`;
const dataUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.data${useCompressed ? '.br' : ''}`;
const frameworkUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.framework.js${useCompressed ? '.br' : ''}`;
const codeUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.wasm${useCompressed ? '.br' : ''}`;

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
    if (unity.UNSAFE__unityInstance) {
      (window as any).unityInstance = unity.UNSAFE__unityInstance;
      (window as any).unityInstance.SendMessage = unity.sendMessage;
    }
    return function cleanup() {
      (window as any).unityInstance = null;
    };
  }, [unity.sendMessage, unity.UNSAFE__unityInstance]);

  return unity;
};

export default useUnityPreConfig;
