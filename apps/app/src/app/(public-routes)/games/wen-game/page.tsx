'use client';

import dynamic from 'next/dynamic';
import { UnityContext } from 'react-unity-webgl';
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false });

const wenBaseUrl = process.env.NEXT_PUBLIC_UNITY_WEN_BASE_URL as string;
const wenBuildVersion = process.env.NEXT_PUBLIC_UNITY_WEN_BASE_VERSION as string;

const wenContext = new UnityContext({
  loaderUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.loader.js`,
  dataUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.data.br`,
  frameworkUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.framework.js.br`,
  codeUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.wasm.br`,
  streamingAssetsUrl: `${wenBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'WENGame',
  productVersion: wenBuildVersion,
});

const WenGame = () => <GameWithAuth unityContext={wenContext} arcadeTokenRequired />;

export default WenGame;
